import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { projectsApi } from "@/lib/services/projectsApi";
import type { Task, TaskWithProject } from "@/types/task";

type CreateTaskInput = {
    projectId: string;
    title: string;
    description: string;
};

type UpdateTaskStatusInput = {
    id: string;
    status: Task["status"];
};

type UpdateTaskInput = Pick<Task, "id" | "title" | "description">;

export const tasksApi = createApi({
    reducerPath: "tasksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/",
    }),
    tagTypes: ["Tasks"],
    endpoints: (builder) => ({
        getProjectTasks: builder.query<Task[], string>({
            query: (projectId) =>
                `projects/${encodeURIComponent(projectId)}/tasks`,
            providesTags: ["Tasks"],
        }),
        getTasks: builder.query<TaskWithProject[], void>({
            query: () => "tasks",
            providesTags: ["Tasks"],
        }),
        createTask: builder.mutation<Task, CreateTaskInput>({
            query: ({ projectId, title, description }) => ({
                url: `projects/${encodeURIComponent(projectId)}/tasks`,
                method: "POST",
                body: { title, description },
            }),
            invalidatesTags: ["Tasks"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(projectsApi.util.invalidateTags(["Dashboard"]));
                } catch {
                    // Ошибку запроса показывает форма.
                }
            },
        }),
        updateTaskStatus: builder.mutation<Task, UpdateTaskStatusInput>({
            query: ({ id, status }) => ({
                url: `tasks/${encodeURIComponent(id)}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Tasks"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(projectsApi.util.invalidateTags(["Dashboard"]));
                } catch {
                    // Ошибку запроса показывает форма.
                }
            },
        }),
        deleteTask: builder.mutation<void, string>({
            query: (id) => ({
                url: `tasks/${encodeURIComponent(id)}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tasks"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(projectsApi.util.invalidateTags(["Dashboard"]));
                } catch {
                    // Ошибку запроса показывает форма.
                }
            },
        }),
        updateTask: builder.mutation<Task, UpdateTaskInput>({
            query: ({ id, title, description }) => ({
                url: `tasks/${encodeURIComponent(id)}`,
                method: "PATCH",
                body: { title, description },
            }),
            invalidatesTags: ["Tasks"],
        }),
    }),
});

export const {
    useGetProjectTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation,
    useDeleteTaskMutation,
    useUpdateTaskMutation,
    useGetTasksQuery,
} = tasksApi;
