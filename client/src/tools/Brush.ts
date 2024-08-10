import { mouseEvent } from "../models/mouseEvent";
import Tool from "./tools";

export default class Brush extends Tool {
    mouseDown: boolean;

    constructor(canvas: any, socket: WebSocket, id: number) {
        super(canvas, socket, id);
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
                type: 'finish',
                x: e.pageX - e.target.offsetLeft,
                y: e.pageY - e.target.offsetTop,
                color: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeColor,
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
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    color: this.ctx.fillStyle,
                    strokeColor: this.ctx.strokeColor,
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    static draw(ctx: any, x: number, y: number, color: string, strokeColor: string, lineWidth: number) {
        ctx.fillStyle = color
        ctx.strokeColor = strokeColor
        ctx.lineWidth = lineWidth
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}