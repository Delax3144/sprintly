import Link from "next/link";
import { ArrowUpRight, FolderKanban, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProjectCardProps = {
    title: string;
    description: string;
    id: string;
    onDelete: () => void;
    isDeleting: boolean;
    isDeleteDisabled: boolean;
    onEdit: () => void;
};

export default function ProjectCard({
    title, description, id, onDelete, isDeleting, isDeleteDisabled, onEdit,
}: ProjectCardProps) {
    return (
        <article className="flex min-w-0 flex-col rounded-lg border bg-card p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
                <span className="rounded-md bg-primary/10 p-2 text-primary">
                    <FolderKanban aria-hidden="true" className="size-4" />
                </span>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" disabled={isDeleteDisabled} aria-label={`Actions for project: ${title}`}>
                            <MoreHorizontal aria-hidden="true" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={onEdit}><Pencil />Edit project</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={onDelete}><Trash2 />Delete project</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <h2 className="font-semibold wrap-anywhere">
                <Link href={`/projects/${encodeURIComponent(id)}`} className="rounded-sm hover:text-primary">
                    {title}
                </Link>
            </h2>
            <p className="mt-2 mb-5 line-clamp-3 text-sm leading-6 text-muted-foreground wrap-anywhere">
                {description || "No description yet."}
            </p>
            <div className="mt-auto border-t pt-3">
                {isDeleting ? <p role="status" className="text-xs text-muted-foreground">Deleting…</p> : (
                    <Link href={`/projects/${encodeURIComponent(id)}`} className="inline-flex items-center gap-2 rounded-sm text-xs font-medium hover:text-primary">
                        Open board <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </Link>
                )}
            </div>
        </article>
    );
}
