import { Request, Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/checkAuth";

// Create new submission
export const createSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, title, fileName, content } = req.body;
    const userId = req.user?.id;

    if (!projectId || !title || !content)
      return res
        .status(400)
        .json({ message: "Project, title, and content required" });

    // Ensure project exists
    const projectCheck = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [projectId],
    );
    if (!projectCheck.rows.length)
      return res.status(404).json({ message: "Project not found" });

    const result = await pool.query(
      `INSERT INTO submissions (projectId, userId, title, fileName, content, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [projectId, userId, title, fileName || null, content],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating submission:", err);
    res.status(500).json({ message: "Failed to create submission" });
  }
};

// List submissions by project
export const getSubmissionsByProject = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id: projectId } = req.params;

    const result = await pool.query(
      `SELECT s.*, u.name AS author_name
       FROM submissions s
       JOIN users u ON s.userId = u.id
       WHERE s.projectId = $1
       ORDER BY s.createdAt DESC`,
      [projectId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};

// View single submission
export const getSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT s.*, u.name AS author_name
       FROM submissions s
       JOIN users u ON s.userId = u.id
       WHERE s.id = $1`,
      [id],
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Submission not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching submission:", err);
    res.status(500).json({ message: "Failed to fetch submission" });
  }
};

// Update submission status
export const updateSubmissionStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = [
      "pending",
      "in_review",
      "approved",
      "changes_requested",
    ];

    if (!allowedStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const result = await pool.query(
      `UPDATE submissions
       SET status = $1, updatedAt = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id],
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Submission not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating submission status:", err);
    res.status(500).json({ message: "Failed to update submission status" });
  }
};

// Delete submission
export const deleteSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Only author can delete
    const submissionCheck = await pool.query(
      "SELECT * FROM submissions WHERE id = $1",
      [id],
    );
    if (!submissionCheck.rows.length)
      return res.status(404).json({ message: "Submission not found" });

    if (submissionCheck.rows[0].userId !== userId)
      return res
        .status(403)
        .json({ message: "You can only delete your own submissions" });

    await pool.query("DELETE FROM submissions WHERE id = $1", [id]);

    res.json({ message: "Submission deleted successfully" });
  } catch (err) {
    console.error("Error deleting submission:", err);
    res.status(500).json({ message: "Failed to delete submission" });
  }
};
