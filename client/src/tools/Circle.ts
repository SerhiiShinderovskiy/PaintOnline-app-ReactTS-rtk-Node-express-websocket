import Tool from "./tools";
import { mouseEvent } from "../models/mouseEvent";

export default class Circle extends Tool {
    mouseDown: boolean;
    startX: number;
    startY: number;
    saved: string;
    width: number;
    height: number;

    constructor(canvas: any, socket: any, id: number) {
        super(canvas, socket, id);
        this.mouseDown = false;
        this.startX = 0;
        this.startY = 0;
        this.saved = '';
        this.width = 0;
        this.height = 0;
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e: mouseEvent) {
        this.mouseDown = false
        let currentX = e.pageX - e.target.offsetLeft;
        let currentY = e.pageY - e.target.offsetTop;
        let width = currentX - this.startX;
        let height = currentY - this.startY;
        let r = Math.sqrt(width**2 + height**2)
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'circle',
                x: this.startX,
                y: this.startY,
                r,
                color: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeColor,
            }
        }))
    }
    mouseDownHandler(e: mouseEvent) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        let canvasData = this.canvas.toDataURL()
        this.saved = canvasData 
    }
    mouseMoveHandler(e: any) {
        if (this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            let width = currentX - this.startX;
            let height = currentY - this.startY;
            let r = Math.sqrt(width**2 + height**2)
            this.draw(this.startX, this.startY, r)
        }
    }

    draw(x: number, y: number, r: number) {
        const img = new Image()
        img.src = this.saved
        img.onload = async () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2*Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx: any, x: number, y: number, r: number, color: string, strokeColor: string, lineWidth: number) {
        ctx.fillStyle = color
        ctx.strokeColor = strokeColor
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke()
    }
}