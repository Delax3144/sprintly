import { configureStore } from "@reduxjs/toolkit";
import { projectsApi } from "./services/projectsApi";

export function makeStore() {
    return configureStore({
        reducer: {
            [projectsApi.reducerPath]: projectsApi.reducer,
        },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(projectsApi.middleware),
    });
}

export type AppStore = ReturnType<typeof makeStore>;