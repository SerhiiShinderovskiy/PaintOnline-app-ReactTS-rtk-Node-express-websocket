import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

export interface ITool {
    tool: any;
}

const initialState: ITool = {
    tool: null,
}

export const toolSlice = createSlice({
    name: 'tool',
    initialState,
    reducers: {
        setTool(state, action: PayloadAction<any>) {
            state.tool = action.payload;
        },
        setFillColor(state, action: PayloadAction<string>) {
            state.tool.fillColor = action.payload;
        },
        setStrokeColor(state, action: PayloadAction<string>) {
            state.tool.strokeColor = action.payload;
        },
        setLineWidth(state, action: PayloadAction<number>) {
            state.tool.lineWidth = action.payload;
        }
    },
})

export const {setTool, setFillColor, setLineWidth, setStrokeColor} = toolSlice.actions;
export default toolSlice.reducer;