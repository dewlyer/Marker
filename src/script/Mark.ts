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
    private origin: {
        x: number,
        y: number
        width: number,
        height: number,
    };
    private readonly groupId: string;
    private selected: boolean;
    private checked: boolean;

    public constructor(
        private readonly _id: string,
        private _x: number,
        private _y: number,
        private _width: number,
        private _height: number,
        groupId?: string,
        checked?: boolean
    ) {
        if (typeof groupId === 'string') {
            this.groupId = groupId;
        }
        this.initialize(checked);
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

    public getGroupId(): string {
        return this.groupId;
    }

    public select(): void {
        this.selected = true;
    }

    public unselect(): void {
        this.selected = false;
    }

    public isSelected(): boolean {
        return this.selected;
    }

    public check(check: boolean): void {
        this.checked = check;
    }

    public isChecked(): boolean {
        return this.checked;
    }

    public getOrigin() {
        return this.origin;
    }

    public setOrigin(origin) {
        return this.origin = origin;
    }

    public initOrigin(): void {
        this.origin = {
            width: this._width,
            height: this._height,
            x: this._x,
            y: this._y
        };
    }

    private initialize(checked?: boolean): void {
        this.selected = false;
        this.checked = !!checked;
        this.initOrigin();
    }
}
