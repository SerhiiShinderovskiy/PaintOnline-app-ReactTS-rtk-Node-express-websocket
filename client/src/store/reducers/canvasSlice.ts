import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

export interface ICanvas {
    canvas: any;
    socket: WebSocket | null;
    sessionid: string | null;
    undoList: any;
    redoList: any;
    username: string;
}

const initialState: ICanvas = {
    canvas: null,
    socket: null,
    sessionid: null,
    undoList: [],
    redoList: [],
    username: "",
}

export const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers: {
        setCanvas(state, action: PayloadAction<any>) {
            state.canvas = action.payload;
        },
        setSessionId(state, action: PayloadAction<string>) {
            state.sessionid = action.payload;
        },
        setSocket(state, action: PayloadAction<WebSocket>) {
            state.socket = action.payload;
        },
        setUsername(state, action: PayloadAction<string>) {
            state.username = action.payload;
        },
        pushToUndo(state, action: PayloadAction<any>) {
            state.undoList.push(action.payload);
        },
        pushToRedo(state, action: PayloadAction<any>) {
            state.redoList.push(action.payload);
        },
        undo(state) {
            const canvas = state.canvas
            let ctx = canvas.getContext('2d')
            if (state.undoList.length > 0 && state.canvas) {
                let dataUrl = state.undoList.pop()
                state.redoList.push(canvas.toDataURL())
                let img = new Image()
                img.src = dataUrl
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                }
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            }
        },
        redo(state) {
            const canvas = state.canvas
            let ctx = canvas.getContext('2d')
            if (state.redoList.length > 0 && state.canvas) {
                let dataUrl = state.redoList.pop()
                state.undoList.push(canvas.toDataURL())
                let img = new Image()
                img.src = dataUrl
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                }
            }
        }
    },
})

export const {
    setCanvas, 
    setSessionId, 
    setSocket, 
    setUsername, 
    pushToRedo, 
    pushToUndo, 
    undo, 
    redo
} = canvasSlice.actions;
export default canvasSlice.reducer;