import db from "@/lib/db";

type DeleteProjectContext = {
    params: Promise<{ id: string }>;
};

export async function DELETE(
    request: Request,
    context: DeleteProjectContext
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