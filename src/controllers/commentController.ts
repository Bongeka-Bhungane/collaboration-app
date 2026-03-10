import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/checkAuth";

/**
 * Add comment to submission
 */
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const submissionId = req.params.id;
    const { content, lineNumber, parentCommentId } = req.body;
    const userId = req.user?.id;

    if (!content) {
      return res.status(400).json({ message: "Comment content required" });
    }

    // Find reviewer record
    const reviewer = await pool.query(
      "SELECT id FROM reviewers WHERE userId = $1",
      [userId],
    );

    if (!reviewer.rows.length) {
      return res.status(403).json({ message: "Only reviewers can comment" });
    }

    const reviewerId = reviewer.rows[0].id;

    const result = await pool.query(
      `INSERT INTO comments (submissionId, reviewerId, content, lineNumber, parentCommentId)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        submissionId,
        reviewerId,
        content,
        lineNumber || null,
        parentCommentId || null,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

/**
 * List comments for submission
 */
export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const submissionId = req.params.id;

    const result = await pool.query(
      `SELECT c.*, u.name AS reviewerName
       FROM comments c
       JOIN reviewers r ON c.reviewerId = r.id
       JOIN users u ON r.userId = u.id
       WHERE c.submissionId = $1
       ORDER BY c.createdAt ASC`,
      [submissionId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

/**
 * Update comment
 */
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!content) {
      return res.status(400).json({ message: "Content required" });
    }

    const commentCheck = await pool.query(
      `SELECT c.*, r.userId
       FROM comments c
       JOIN reviewers r ON c.reviewerId = r.id
       WHERE c.id = $1`,
      [commentId],
    );

    if (!commentCheck.rows.length) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (commentCheck.rows[0].userid !== userId) {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this comment" });
    }

    const result = await pool.query(
      `UPDATE comments
       SET content = $1, updatedAt = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [content, commentId],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Failed to update comment" });
  }
};

/**
 * Delete comment
 */
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.id;
    const userId = req.user?.id;

    const commentCheck = await pool.query(
      `SELECT c.*, r.userId
       FROM comments c
       JOIN reviewers r ON c.reviewerId = r.id
       WHERE c.id = $1`,
      [commentId],
    );

    if (!commentCheck.rows.length) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (commentCheck.rows[0].userid !== userId) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this comment" });
    }

    await pool.query("DELETE FROM comments WHERE id = $1", [commentId]);

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
