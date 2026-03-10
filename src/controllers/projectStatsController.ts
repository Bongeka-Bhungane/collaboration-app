import { Request, Response } from "express";
import { pool } from "../config/db";

export const getProjectStats = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;

    // Total submissions
    const submissions = await pool.query(
      "SELECT COUNT(*) FROM submissions WHERE projectId = $1",
      [projectId],
    );

    // Submissions by status
    const statusCounts = await pool.query(
      `SELECT status, COUNT(*) 
       FROM submissions 
       WHERE projectId = $1 
       GROUP BY status`,
      [projectId],
    );

    // Average review time
    const avgReviewTime = await pool.query(
      `SELECT AVG(EXTRACT(EPOCH FROM (r.createdAt - s.createdAt))) AS avgReviewTime
       FROM reviews r
       JOIN submissions s ON r.submissionId = s.id
       WHERE s.projectId = $1`,
      [projectId],
    );

    // Most active reviewers
    const activeReviewers = await pool.query(
      `SELECT u.name, COUNT(*) AS reviewCount
       FROM reviews r
       JOIN reviewers rv ON r.reviewerId = rv.id
       JOIN users u ON rv.userId = u.id
       JOIN submissions s ON r.submissionId = s.id
       WHERE s.projectId = $1
       GROUP BY u.name
       ORDER BY reviewCount DESC
       LIMIT 5`,
      [projectId],
    );

    // Most commented submission
    const mostCommented = await pool.query(
      `SELECT s.id, s.fileName, COUNT(c.id) AS commentCount
       FROM submissions s
       LEFT JOIN comments c ON c.submissionId = s.id
       WHERE s.projectId = $1
       GROUP BY s.id
       ORDER BY commentCount DESC
       LIMIT 1`,
      [projectId],
    );

    res.json({
      totalSubmissions: submissions.rows[0].count,
      statusCounts: statusCounts.rows,
      avgReviewTime: avgReviewTime.rows[0].avgreviewtime,
      activeReviewers: activeReviewers.rows,
      mostCommentedSubmission: mostCommented.rows[0] || null,
    });
  } catch (error) {
    console.error("Error fetching project stats:", error);
    res.status(500).json({ message: "Failed to fetch project stats" });
  }
};
