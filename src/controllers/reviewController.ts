import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/checkAuth";

/**
 * Approve submission
 */
export const approveSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const submissionId = req.params.id;
    const { comment } = req.body;
    const userId = req.user?.id;

    const reviewer = await pool.query(
      "SELECT id FROM reviewers WHERE userId = $1",
      [userId],
    );

    if (!reviewer.rows.length) {
      return res
        .status(403)
        .json({ message: "Only reviewers can approve submissions" });
    }

    const reviewerId = reviewer.rows[0].id;

    await pool.query(
      `INSERT INTO reviews (submissionId, reviewerId, decision, comment)
       VALUES ($1, $2, 'approved', $3)`,
      [submissionId, reviewerId, comment || null],
    );

    await pool.query(
      `UPDATE submissions
       SET status = 'approved', updatedAt = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [submissionId],
    );

    res.json({ message: "Submission approved" });
  } catch (error) {
    console.error("Approve error:", error);
    res.status(500).json({ message: "Failed to approve submission" });
  }
};

/**
 * Request changes
 */
export const requestChanges = async (req: AuthRequest, res: Response) => {
  try {
    const submissionId = req.params.id;
    const { comment } = req.body;
    const userId = req.user?.id;

    const reviewer = await pool.query(
      "SELECT id FROM reviewers WHERE userId = $1",
      [userId],
    );

    if (!reviewer.rows.length) {
      return res
        .status(403)
        .json({ message: "Only reviewers can request changes" });
    }

    const reviewerId = reviewer.rows[0].id;

    await pool.query(
      `INSERT INTO reviews (submissionId, reviewerId, decision, comment)
       VALUES ($1, $2, 'changes_requested', $3)`,
      [submissionId, reviewerId, comment || null],
    );

    await pool.query(
      `UPDATE submissions
       SET status = 'changes_requested', updatedAt = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [submissionId],
    );

    res.json({ message: "Changes requested for submission" });
  } catch (error) {
    console.error("Request changes error:", error);
    res.status(500).json({ message: "Failed to request changes" });
  }
};

/**
 * Get review history
 */
export const getReviewHistory = async (req: AuthRequest, res: Response) => {
  try {
    const submissionId = req.params.id;

    const result = await pool.query(
      `SELECT r.*, u.name AS reviewerName
       FROM reviews r
       JOIN reviewers rv ON r.reviewerId = rv.id
       JOIN users u ON rv.userId = u.id
       WHERE r.submissionId = $1
       ORDER BY r.createdAt DESC`,
      [submissionId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Review history error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
