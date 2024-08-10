import Tool from "./tools";
import { mouseEvent } from "../models/mouseEvent";

export default class Line extends Tool {
    mouseDown: boolean;
    currentX: number;
    currentY: number;
    saved: string;
    name: string;

    constructor(canvas: any, socket: WebSocket, id: number) {
        super(canvas, socket, id);
        this.mouseDown = false;
        this.currentX = 0;
        this.currentY = 0;
        this.saved = '';
        this.name = 'Line';
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e: mouseEvent) {
        this.mouseDown = false
        const endX = e.pageX - e.target.offsetLeft;
        const endY = e.pageY - e.target.offsetTop;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'line',
                start: {x: this.currentX, y: this.currentY},
                end: {x: endX, y: endY},
                color: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeColor,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }
    mouseDownHandler(e: mouseEvent) {
        this.mouseDown = true
        this.currentX = e.pageX - e.target.offsetLeft
        this.currentY = e.pageY - e.target.offsetTop
        this.ctx.beginPath()
        this.ctx.moveTo(this.currentX, this.currentY)
        this.saved = this.canvas.toDataURL()
        
    }
    mouseMoveHandler(e: any) {
        if (this.mouseDown) {
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        }
    }

    draw(x: number, y: number) {
        const img = new Image()
        img.src = this.saved
        img.onload = async () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.currentX, this.currentY)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }
    }

    static staticDrawLine(
        ctx: any, 
        start: {x: number, y: number}, 
        end: {x: number, y: number}, 
        color: string, 
        strokeColor: string, 
        lineWidth: number) 
    {
        ctx.fillStyle = color
        ctx.strokeColor = strokeColor
        ctx.lineWidth = lineWidth
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
    }
}