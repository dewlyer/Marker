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
    public origin: { width: number, height: number, x: number, y: number };
    public selectPosition: { x: number, y: number };

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
        if (!!groupId) {
            this.groupId = groupId;
        }
        this.selected = false;
        this.checked = !!checked;
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

    public getGroupId() {
        return this.groupId;
    }

    public select() {
        this.selected = true;
    }

    public unselect() {
        this.selected = false;
    }

    public isSelected() {
        return this.selected;
    }

    public check(check: boolean) {
        this.checked = check;
    }

    public isChecked() {
        return this.checked;
    }

    public saveSelectPosition(position) {
        this.selectPosition = position;
    }

    public saveOrigin() {
        this.origin = {
            width: this.width,
            height: this.height,
            x: this._x,
            y: this._y
        };
    }

    private initialize(): void {}
}
