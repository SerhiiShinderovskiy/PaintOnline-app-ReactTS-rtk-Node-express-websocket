import React, { FC, useEffect, useRef, useState } from 'react';
import "../styles/canvas.scss";
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { pushToUndo, setCanvas, setSessionId, setSocket, setUsername } from '../store/reducers/canvasSlice';
import { setTool } from '../store/reducers/toolSlice';
import Brush from '../tools/Brush';
import { Button, Modal } from 'react-bootstrap';
import {useParams} from "react-router-dom";
import Rect from '../tools/Rect';
import axios from 'axios';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';
import { toast } from 'react-toastify';

const Canvas: FC = () => {
    const dispatch = useAppDispatch()
    const username = useAppSelector<string>(state => state.canvaser.username)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null)
    const [modal, setModal] = useState<boolean>(true)
    const params = useParams()
    

    useEffect(() => {
        if (canvasRef.current && params.id) {
            dispatch(setCanvas(canvasRef.current))
            let ctx = canvasRef.current?.getContext('2d')
            axios.get(`http://localhost:5000/image?id=${params.id}`)
                .then(response => {
                    const img = new Image()
                    img.src = response.data
                    img.onload = () => {
                        if (canvasRef.current && ctx) {
                            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                        }
                    }
                })
                .catch(error => {
                    console.log("Failed to load image: ", error)
                })
        }
        
    }, [])

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:5000/`);
        if (username && params.id && socket) {
            dispatch(setSocket(socket))
            dispatch(setSessionId(params.id))
            dispatch(setTool(new Brush(canvasRef.current, socket, Number(params.id))))
            socket.onopen = () => {
                console.log("The connection is established");
                socket.send(JSON.stringify({
                    id: params.id,
                    username,
                    method: 'connection'
                }))
            }
            socket.onmessage = (event: MessageEvent) => {
                try {
                    let msg = JSON.parse(event.data)
                    switch (msg.method) {
                        case "connection":
                            toast.info(`User ${msg.username} has joined`, {autoClose: 3000});
                            break;
                        case "draw":
                            drawHandler(msg)
                            break;
                        default:
                            console.warn("Unknown message method:", msg.method);
                    }
                } catch (error) {
                    console.log("Received non-JSON message:", event.data);
                }
            };
        }
    }, [username])

    const drawHandler = (msg: any) => {
        const figure = msg.figure
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d')
            switch (figure.type) {
                case "brush":
                    Brush.draw(ctx, figure.x, figure.y, figure.color, figure.strokeColor, figure.lineWidth)
                    break
                case "rect":
                    Rect.staticdraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
                    break
                case "circle":
                    Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color, figure.strokeColor, figure.lineWidth)
                    break
                case "eraser":
                    Eraser.staticDrawEraser(ctx, figure.x, figure.y, figure.lineWidth)
                    break
                case "line":
                    Line.staticDrawLine(ctx, figure.start, figure.end, figure.color, figure.strokeColor, figure.lineWidth)
                    break
                case "finish":
                    ctx?.beginPath()
                    break
            }
        }
    }

    const mouseDownHandler = () => {
        if (canvasRef.current) {
            dispatch(pushToUndo([canvasRef.current.toDataURL()]))
        }
    }

    const mouseUpHandler = () => {
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current?.toDataURL()})
            .catch(response => console.log(response.data))
    }

    const connectionHandler = () => {
        if (usernameRef.current) {
            dispatch(setUsername(usernameRef.current.value))
            setModal(false)
        }
    }

    return (
        <div className='canvas'>
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header>
                <Modal.Title>Enter your name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => connectionHandler()}>
                    Sign in
                </Button>
                </Modal.Footer>
            </Modal>
            <canvas 
                id='canvas'
                onMouseDown={() => mouseDownHandler()} 
                onMouseUp={() => mouseUpHandler()}
                ref={canvasRef} width={800} height={600}
            />
        </div>
    );
};

export default Canvas;