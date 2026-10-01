import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Project } from "@/types/project";
import type { DashboardSummary } from "@/types/dashboard";

export const projectsApi = createApi({
    reducerPath: "projectsApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "/api/",
    }),

    tagTypes: ["Projects", "Dashboard"],

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
            invalidatesTags: ["Projects", "Dashboard"],
        }),
        updateProject: builder.mutation<Project, Project>({
            query: ({ id, title, description }) => ({
                url: `projects/${encodeURIComponent(id)}`,
                method: "PATCH",
                body: { title, description },
            }),
            invalidatesTags: ["Projects", "Dashboard"],
        }),
        deleteProject: builder.mutation<void, string>({
            query: (id) => ({
                url: `projects/${encodeURIComponent(id)}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Projects", "Dashboard"],
        }),
        getProject: builder.query<Project, string>({
            query: (id) => `projects/${encodeURIComponent(id)}`,
            providesTags: ["Projects"],
        }),
        getDashboardSummary: builder.query<DashboardSummary, void>({
            query: () => "dashboard",
            providesTags: ["Dashboard"],
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetProjectQuery,
    useGetDashboardSummaryQuery,
} = projectsApi;
