import { MarkImage } from './Image';
import { Mark } from './Mark';

export class MarkCanvas {
    private ctx: CanvasRenderingContext2D;
    private scale: number;
    private image: MarkImage;

    private getCanvasScale(): number {
        return this.scale.zoom;
    }

    public constructor(private el: HTMLCanvasElement, url: string) {
        this.initialize(url);
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

    // draw

    public drawBackground(): void {
        let {width, height} = this.image.getSize();
        this.setSize(width, height);
        this.ctx.drawImage(this.image.getElement(), 0, 0, width, height);
    }

    public drawCurrentMark(): void {
        let scale = this.getCanvasScale();
        let current = this.getCurrentMark();

        this.ctx.save();
        this.ctx.strokeStyle = this.settings.line.color.active;
        this.ctx.lineWidth = this.settings.line.width;
        this.ctx.setLineDash(this.settings.line.dash);
        this.ctx.strokeRect(
            current.x * scale,
            current.y * scale,
            current.width * scale,
            current.height * scale
        );
        this.ctx.restore();
    }

    public drawMarkList(selected: boolean): void {
        let _this = this;
        let selectIndex: number = null;

        if (selected) {
            selectIndex = this.getSelectedMarkIndex();
        }

        this.ctx.save();
        this.ctx.lineJoin = this.settings.line.join;
        this.ctx.lineWidth = this.settings.line.width;
        this.ctx.strokeStyle = this.settings.line.color.normal;
        this.ctx.fillStyle = this.settings.rect.color.normal;

        this.markList.list.forEach(function (item, index) {
            if (selectIndex === index) {
                _this.ctx.save();
                _this.ctx.strokeStyle = _this.settings.line.color.select;
                _this.ctx.fillStyle = _this.settings.rect.color.select;
                _this.ctx.lineWidth = _this.settings.line.width;
                _this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                _this.ctx.shadowOffsetX = 0;
                _this.ctx.shadowOffsetY = 2;
                _this.ctx.shadowBlur = 3;
            }
            _this.ctx.fillRect(
                item.x * _this.scale.zoom,
                item.y * _this.scale.zoom,
                item.width * _this.scale.zoom,
                item.height * _this.scale.zoom
            );
            _this.ctx.strokeRect(
                item.x * _this.scale.zoom,
                item.y * _this.scale.zoom,
                item.width * _this.scale.zoom,
                item.height * _this.scale.zoom
            );
            if (selectIndex === index) {
                _this.ctx.restore();
            }
            _this.drawCoordinate(item, index, selected, selectIndex);
        });

        _this.ctx.restore();
    }

    public drawCoordinate(item: Mark, index: number, selected: boolean, selectIndex: number): void {
        let verOffset = 4;
        let horOffset = 4;
        let str = `ID: ${item.id} - X: ${item.x} - Y: ${item.y} - Z: ${index} - W: ${item.width} - H: ${item.height}`;
        let scale = this.getCanvasScale();

        this.ctx.save();
        this.ctx.font = this.settings.text.font;
        this.ctx.fillStyle = this.settings.text.color;
        this.ctx.fillRect(
            item.x * scale - 1,
            item.y * scale - 1,
            this.ctx.measureText(str).width + horOffset,
            -parseInt(this.settings.text.font, 10) - verOffset
        );
        this.ctx.fillStyle = (selected && selectIndex === index) ? this.settings.line.color.select : this.settings.line.color.normal;
        this.ctx.fillText(str, item.x * scale, item.y * scale - verOffset);
        this.ctx.restore();
    }

    public redraw(selected?: boolean): void {
        this.clear();
        this.drawBackground();
        this.drawMarkList(selected);
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
    }

    public ready(callback) {
        let _this = this;
        this.image.loadComplete(() => {
            if (_this.image.hasSource()) {
                if (typeof callback === 'function') {
                    callback();
                }
            } else {
                console.warn('图片加载错误');
            }
        });
    }

    private initialize(url) {
        this.image = new MarkImage(url);
        this.ctx = this.el.getContext('2d');
        this.scale = 1;
    }
}
