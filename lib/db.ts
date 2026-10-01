import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), "data");

mkdirSync(dataDirectory, { recursive: true });

const db = new Database(
    path.join(dataDirectory, "sprintly.db")
);

db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT ''
    )
`);

db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        projectId TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'todo'
            CHECK (status IN ('todo', 'in_progress', 'done')),
        FOREIGN KEY (projectId) REFERENCES projects(id)
            ON DELETE CASCADE
    )
`);

export default db;