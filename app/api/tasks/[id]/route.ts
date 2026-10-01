import db from "@/lib/db";
import type { Task } from "@/types/task";

type TaskContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(
    request: Request,
    context: TaskContext
) {
    const { id } = await context.params;

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return Response.json(
            { error: "Invalid JSON." },
            { status: 400 }
        );
    }

    if (typeof body !== "object" || body === null) {
        return Response.json(
            { error: "Invalid task data." },
            { status: 400 }
        );
    }

    let changes: number;

    if ("status" in body) {
        if (
            body.status !== "todo" &&
            body.status !== "in_progress" &&
            body.status !== "done"
        ) {
            return Response.json(
                { error: "Invalid task status." },
                { status: 400 }
            );
        }

        changes = db
            .prepare("UPDATE tasks SET status = ? WHERE id = ?")
            .run(body.status, id)
            .changes;
    } else {
        if (
            !("title" in body) ||
            typeof body.title !== "string" ||
            !body.title.trim() ||
            !("description" in body) ||
            typeof body.description !== "string"
        ) {
            return Response.json(
                { error: "A title and string description are required." },
                { status: 400 }
            );
        }

        changes = db
            .prepare(
                "UPDATE tasks SET title = ?, description = ? WHERE id = ?"
            )
            .run(body.title.trim(), body.description.trim(), id)
            .changes;
    }

    if (changes === 0) {
        return Response.json(
            { error: "Task not found." },
            { status: 404 }
        );
    }

    const task = db
        .prepare<[string], Task>(
            `SELECT id, projectId, title, description, status
             FROM tasks
             WHERE id = ?`
        )
        .get(id);

    return Response.json(task);
}

export async function DELETE(
    request: Request,
    context: TaskContext
) {
    const { id } = await context.params;

    const result = db
        .prepare("DELETE FROM tasks WHERE id = ?")
        .run(id);

    if (result.changes === 0) {
        return Response.json(
            { error: "Task not found." },
            { status: 404 }
        );
    }

    return new Response(null, { status: 204 });
}