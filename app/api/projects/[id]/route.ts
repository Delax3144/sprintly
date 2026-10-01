import db from "@/lib/db";

import type { Project } from "@/types/project";

type ProjectRouteContext = {
    params: Promise<{ id: string }>;
};

export async function DELETE(
    request: Request,
    context: ProjectRouteContext
) {
    const { id } = await context.params;

    const result = db
        .prepare("DELETE FROM projects WHERE id = ?")
        .run(id);

    if (result.changes === 0) {
        return Response.json(
            { error: "Project not found." },
            { status: 404 }
        );
    }

    return new Response(null, { status: 204 });
}

export async function PATCH(
    request: Request,
    context: ProjectRouteContext
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

    if (
        typeof body !== "object" ||
        body === null ||
        !("title" in body) ||
        typeof body.title !== "string" ||
        !("description" in body) ||
        typeof body.description !== "string"
    ) {
        return Response.json(
            { error: "Title and description must be strings." },
            { status: 400 }
        );
    }

    const title = body.title.trim();
    const description = body.description.trim();

    if (title === "") {
        return Response.json(
            { error: "Enter a project name." },
            { status: 400 }
        );
    }

    const result = db
        .prepare(`
            UPDATE projects
            SET title = ?, description = ?
            WHERE id = ?
        `)
        .run(title, description, id);

    if (result.changes === 0) {
        return Response.json(
            { error: "Project not found." },
            { status: 404 }
        );
    }

    return Response.json({
        id,
        title,
        description,
    });
}

export async function GET(
    request: Request,
    context: ProjectRouteContext
) {
    const { id } = await context.params;

    const project = db
        .prepare<[string], Project>(
            "SELECT id, title, description FROM projects WHERE id = ?"
        )
        .get(id);

    if (!project) {
        return Response.json(
            { error: "Project not found." },
            { status: 404 }
        );
    }

    return Response.json(project);
}