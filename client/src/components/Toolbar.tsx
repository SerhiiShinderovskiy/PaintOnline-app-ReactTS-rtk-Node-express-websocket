import React from 'react';
import "../styles/toolbar.scss";
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setTool } from '../store/reducers/toolSlice';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';
import {setFillColor, setStrokeColor} from "../store/reducers/toolSlice";
import { redo, undo } from '../store/reducers/canvasSlice';

const Toolbar = () => {
    const dispatch = useAppDispatch()
    const canvas = useAppSelector(state => state.canvaser.canvas)
    const socket = useAppSelector(state => state.canvaser.socket)
    const sessionid = useAppSelector(state => state.canvaser.sessionid)
    

    const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFillColor(e.target.value))
        dispatch(setStrokeColor(e.target.value))
    }

    const download = () => {
        const dataUrl = canvas.toDataURL()
        console.log(dataUrl);
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = sessionid + '.jpg'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const handleToolChange = (Tool: any) => {
        if (canvas && socket) {
            dispatch(setTool(new Tool(canvas, socket, sessionid)))
        } else {
            console.error("Canvas or WebSocket is not initialized.");
        }
    }

    return (
        <div className='toolbar'>
            <button className='toolbar-btn brush' onClick={() => handleToolChange(Brush)}></button>
            <button className='toolbar-btn rect' onClick={() => handleToolChange(Rect)}></button>
            <button className='toolbar-btn circle' onClick={() => handleToolChange(Circle)}></button>
            <button className='toolbar-btn eraser' onClick={() => handleToolChange(Eraser)}></button>
            <button className='toolbar-btn line' onClick={() => handleToolChange(Line)}></button>
            <input onChange={e => changeColor(e)} className='toolbar-btn choose-color' type="color"/>
            <button className='toolbar-btn undo' onClick={() => dispatch(undo())}></button>
            <button className='toolbar-btn redo' onClick={() => dispatch(redo())}></button>
            <button className='toolbar-btn save' onClick={() => download()}></button>
        </div>
    );
};

export default Toolbar;