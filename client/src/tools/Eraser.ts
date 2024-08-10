import { mouseEvent } from "../models/mouseEvent";
import Tool from "./tools";

export default class Eraser extends Tool {
    strokeStyle: string;
    mouseDown: boolean;

    constructor(canvas: any, socket: WebSocket, id: number) {
        super(canvas, socket, id)
        this.strokeStyle = '';
        this.mouseDown = false;
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e: any) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: 'finish'
            }
        }))
    }
    mouseDownHandler(e: mouseEvent) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }
    mouseMoveHandler(e: mouseEvent) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: 'eraser',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    strokeColor: this.ctx.strokeColor,
                    lineWidth: this.ctx.lineWidth
                }
            }))
            this.ctx.strokeColor = 'white'
        }
    }

    draw(x: number, y: number) {
        this.ctx.strokeStyle = "white"
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
    }

    static staticDrawEraser(ctx: any, x: number, y: number, lineWidth: number) {
        ctx.strokeStyle = "white"
        ctx.lineWidth = lineWidth
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}