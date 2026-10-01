import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Project } from "@/types/project";

export const projectsApi = createApi({
    reducerPath: "projectsApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "/api/",
    }),

    tagTypes: ["Projects"],

    endpoints: (builder) => ({
        getProjects: builder.query<Project[], void>({
            query: () => "projects",
            providesTags: ["Projects"],
        }),
        createProject: builder.mutation<
            Project,
            Pick<Project, "title" | "description">
        >({
            query: (body) => ({
                url: "projects",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Projects"],
        }),
        updateProject: builder.mutation<Project, Project>({
            query: ({ id, title, description }) => ({
                url: `projects/${encodeURIComponent(id)}`,
                method: "PATCH",
                body: { title, description },
            }),
                invalidatesTags: ["Projects"],
        }),
        deleteProject: builder.mutation<void, string>({
            query: (id) => ({
                url: `projects/${encodeURIComponent(id)}`,
                method: "DELETE",
            }),
                invalidatesTags: ["Projects"],
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} = projectsApi;