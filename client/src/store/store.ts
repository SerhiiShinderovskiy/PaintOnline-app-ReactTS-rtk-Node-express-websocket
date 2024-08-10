import { configureStore } from "@reduxjs/toolkit";
import toolReducer from "./reducers/toolSlice";
import canvasReducer from "./reducers/canvasSlice";

export const store = configureStore({
    reducer: {
        tooler: toolReducer,
        canvaser: canvasReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch