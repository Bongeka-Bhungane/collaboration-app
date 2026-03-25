import { pool } from "./db";

export const initDb = async () => {
  try {
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE userRole AS ENUM ('submitter', 'reviewer');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE projectStatus AS ENUM ('pending', 'in_review', 'approved', 'changes_requested');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(150) NOT NULL,
        role userRole NOT NULL,
        pictureUrl TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        userId INT NOT NULL REFERENCES users(id),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviewers (
        id SERIAL PRIMARY KEY,
        projectId INT NOT NULL REFERENCES projects(id),
        userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role userRole NOT NULL,
        joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (projectId, userId)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        projectId INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        fileName VARCHAR(200),
        content TEXT NOT NULL,
        status projectStatus DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        submissionId INT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
        reviewerId INT NOT NULL REFERENCES reviewers(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        lineNumber INT,
        parentCommentId INT REFERENCES comments(id) ON DELETE CASCADE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("DB init error:", error);
  }
};
