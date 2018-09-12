export type ImageSize = {
    width: number;
    height: number;
};

export class MarkImage {
    private el: HTMLImageElement;

    public constructor(private src: string) {
        this.initialize();
    }

    public getElement(): HTMLImageElement {
        return this.el;
    }

    public getSize(): ImageSize {
        return {
            width: this.el.naturalWidth || this.el.width,
            height: this.el.naturalHeight || this.el.height
        };
    }

    public hasSource(): boolean {
        return !!this.el.src;
    }

    public loadComplete(callback: () => void): void {
        this.el.src = this.src;
        this.el.addEventListener('load', () => {
            callback();
        });
    }

    private initialize(): void {
        this.el = new Image();
    }
}
