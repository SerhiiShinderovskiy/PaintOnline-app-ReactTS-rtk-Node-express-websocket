export default class Tool {
    canvas: any;
    ctx: any;
    socket: any;
    id: number;

    constructor(canvas: HTMLCanvasElement, socket: any, id: number) {
        this.canvas = canvas
        this.socket = socket
        this.id = id
        this.ctx = canvas.getContext('2d')
        this.destroyEvents()
    }

    // Setters
    set fillColor(color: string) {
        this.ctx.fillStyle = color
    }
    set strokeColor(color: string) {
        this.ctx.strokeStyle = color
    }
    
    set lineWidth(width: number) {
        this.ctx.lineWidth = width
    }

    destroyEvents() {
        this.canvas.onmousemove = null
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
    }
}