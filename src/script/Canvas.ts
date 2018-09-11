export class MarkCanvas {
    private ctx: CanvasRenderingContext2D;
    private scale: number;

    public constructor(private el: HTMLCanvasElement) {
        this.initialize();
    }

    public addEvent(type, listener) {
        this.el.addEventListener(type, listener);
    }

    public removeEvent(type, listener) {
        this.el.removeEventListener(type, listener);
    }

    public setSize(width, height) {
        this.el.width = width * this.scale;
        this.el.height = height * this.scale;
    }

    public setStyle(style) {
        this.el.setAttribute('style', style);
    }

    public drawBackground(image): void {
        this.setSize(width, height);
        this.ctx.drawImage(image, 0, 0, width, height);
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
    }

    private initialize() {
        this.scale = 1;
        this.ctx = this.el.getContext('2d');
    }
}
