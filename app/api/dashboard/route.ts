import db from "@/lib/db";
import type { DashboardSummary } from "@/types/dashboard";

export async function GET() {
    const summary = db
        .prepare<[], DashboardSummary>(`
            SELECT
                (SELECT COUNT(*) FROM projects) AS projectsCount,
                COUNT(*) AS tasksCount,
                COUNT(CASE WHEN status = 'todo' THEN 1 END) AS todoCount,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) AS inProgressCount,
                COUNT(CASE WHEN status = 'done' THEN 1 END) AS doneCount
            FROM tasks
        `)
        .get();

    return Response.json(summary);
}