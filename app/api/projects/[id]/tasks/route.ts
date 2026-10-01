import db from "@/lib/db";
import type { Task } from "@/types/task";

type ProjectTasksContext = {
    params: Promise<{ id: string }>;
};

export async function GET(
    request: Request,
    context: ProjectTasksContext
) {
    const { id } = await context.params;

    const project = db
        .prepare<[string], { id: string }>(
            "SELECT id FROM projects WHERE id = ?"
        )
        .get(id);

    if (!project) {
        return Response.json(
            { error: "Project not found." },
            { status: 404 }
        );
    }

    const tasks = db
        .prepare<[string], Task>(
            `SELECT id, projectId, title, description, status
             FROM tasks
             WHERE projectId = ?`
        )
        .all(id);

    return Response.json(tasks);
}

export async function POST(
    request: Request,
    context: ProjectTasksContext
) {
    const { id } = await context.params;

    const project = db
        .prepare<[string], { id: string }>(
            "SELECT id FROM projects WHERE id = ?"
        )
        .get(id);

    if (!project) {
        return Response.json(
            { error: "Project not found." },
            { status: 404 }
        );
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return Response.json(
            { error: "Invalid JSON." },
            { status: 400 }
        );
    }

    if (
        typeof body !== "object" ||
        body === null ||
        !("title" in body) ||
        typeof body.title !== "string" ||
        !body.title.trim()
    ) {
        return Response.json(
            { error: "Title is required." },
            { status: 400 }
        );
    }

    if (
        "description" in body &&
        typeof body.description !== "string"
    ) {
        return Response.json(
            { error: "Description must be a string." },
            { status: 400 }
        );
    }

    const task: Task = {
        id: crypto.randomUUID(),
        projectId: id,
        title: body.title.trim(),
        description:
            "description" in body && typeof body.description === "string"
                ? body.description.trim()
                : "",
        status: "todo",
    };

    db.prepare(
        `INSERT INTO tasks (id, projectId, title, description, status)
         VALUES (?, ?, ?, ?, ?)`
    ).run(
        task.id,
        task.projectId,
        task.title,
        task.description,
        task.status
    );

    return Response.json(task, { status: 201 });
}