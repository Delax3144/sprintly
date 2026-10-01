import db from "@/lib/db";
import type { TaskWithProject } from "@/types/task";

export async function GET() {
    const tasks = db
        .prepare<[], TaskWithProject>(`
            SELECT
                tasks.id,
                tasks.projectId,
                tasks.title,
                tasks.description,
                tasks.status,
                projects.title AS projectTitle
            FROM tasks
            INNER JOIN projects ON tasks.projectId = projects.id
        `)
        .all();

    return Response.json(tasks);
}