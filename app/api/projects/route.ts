import db from "@/lib/db";
import type { Project } from "@/types/project";

export async function GET() {
    const projects = db
        .prepare<[], Project>(
            "SELECT id, title, description FROM projects"
        )
        .all();

    return Response.json(projects);
}

export async function POST(request: Request) {
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
        typeof body.title !== "string"
    ) {
        return Response.json(
            { error: "Project title must be a string." },
            { status: 400 }
        );
    }

    const title = body.title.trim();

    if (title === "") {
        return Response.json(
            { error: "Enter a project name." },
            { status: 400 }
        );
    }

    let description = "";

    if ("description" in body) {
        if (typeof body.description !== "string") {
            return Response.json(
                { error: "Project description must be a string." },
                { status: 400 }
            );
        }

        description = body.description.trim();
    }

    const project: Project = {
        id: crypto.randomUUID(),
        title,
        description,
    };

    db.prepare(`
        INSERT INTO projects (id, title, description)
        VALUES (?, ?, ?)
    `).run(project.id, project.title, project.description);

    return Response.json(project, { status: 201 });
}