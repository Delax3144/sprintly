import { configureStore } from "@reduxjs/toolkit";
import { projectsApi } from "./services/projectsApi";
import { tasksApi } from "@/lib/services/tasksApi";

export function makeStore() {
    return configureStore({
        reducer: {
            [projectsApi.reducerPath]: projectsApi.reducer,
            [tasksApi.reducerPath]: tasksApi.reducer,
        },

        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                projectsApi.middleware,
                tasksApi.middleware
            ),
    });
}

export type AppStore = ReturnType<typeof makeStore>;
