export class MarkImage {
    private el: HTMLImageElement;

    public constructor(private src: string) {
        this.initialize();
    }

    public loadComplete(callback: () => void): void {
        this.el.src = this.src;
        this.el.addEventListener('load', () => {
            callback();
        });
    }

    public hasSource() {
        return !!this.el.src;
    }

    public getElement() {
        return this.el;
    }

    public getSize(): { width: number, height: number } {
        return {
            width: this.el.naturalWidth || this.el.width,
            height: this.el.naturalHeight || this.el.height
        };
    }

    private initialize() {
        this.el = new Image();
    }
}
