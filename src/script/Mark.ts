/**
 * Mark Class
 */

export interface MarkInterface {
    readonly id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Mark implements MarkInterface {
    // private static penWidth = 1;
    public origin: { x: number, y: number };
    public selectPosition: { x: number, y: number };
    private selected: boolean;

    public constructor(
        private readonly _id: string,
        private _x: number,
        private _y: number,
        private _width: number,
        private _height: number
    ) {
        this.initialize();
    }

    public get id(): string {
        return this._id;
    }

    public get x(): number {
        return this._x;
    }

    public set x(x: number) {
        this._x = x;
    }

    public get y(): number {
        return this._y;
    }

    public set y(y: number) {
        this._y = y;
    }

    public get width(): number {
        return this._width;
    }

    public set width(width: number) {
        this._width = width;
    }

    public get height(): number {
        return this._height;
    }

    public set height(height: number) {
        this._height = height;
    }

    public calculateArea(): number {
        return this.width * this.height;
    }

    public select() {
        this.selected = true;
    }

    public unselect() {
        this.selected = false;
    }

    public saveSelectPosition(position) {
        this.selectPosition = position;
    }

    public saveOrigin() {
        this.origin = {
            x: this._x,
            y: this._y
        };
    }

    public isSelected() {
        return this.selected;
    }

    private initialize(): void {
        this.selected = false;
        console.log('Class Mark Initialize Successfully', this.id);
    }
}
