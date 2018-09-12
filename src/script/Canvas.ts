import { MarkImage } from './Image';
import { MarkList } from './MarkList';
import { Mark } from './Mark';

export class MarkCanvas {
    private ctx: CanvasRenderingContext2D;
    private scale: number;
    private style: any;
    private image: MarkImage;

    public constructor(private el: HTMLCanvasElement, url: string, style) {
        this.initialize(url, style);
    }

    public getScale(): number {
        return this.scale;
    }

    public setScale(scale: number): void {
        this.scale = scale;
    }

    public addEvent(type, target, listener) {
        this.el.addEventListener(type,  (e) => {
            target[listener](e);
        });
    }

    public removeEvent(type, target, listener) {
        this.el.removeEventListener(type,  (e) => {
            target[listener](e);
        });
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

    public drawCurrentMark(current: Mark): void {
        this.ctx.save();
        this.ctx.strokeStyle = this.style.line.color.active;
        this.ctx.lineWidth = this.style.line.width.active;
        this.ctx.setLineDash(this.style.line.dash.active);
        this.ctx.strokeRect(
            current.x * this.scale,
            current.y * this.scale,
            current.width * this.scale,
            current.height * this.scale
        );
        this.ctx.restore();
    }

    public drawMarkList(markList: MarkList, selectedIndex: number): void {
        let _this = this;
        let selectIndex: number = null;

        if (typeof selectedIndex !== 'undefined') {
            // selectIndex = this.getSelectedMarkIndex();
        }

        this.ctx.save();
        this.ctx.lineJoin = this.style.line.join.normal;
        this.ctx.lineWidth = this.style.line.width.normal;
        this.ctx.strokeStyle = this.style.line.color.normal;
        this.ctx.fillStyle = this.style.rect.color.normal;

        markList.list.forEach(function (item, index) {
            if (selectIndex === index) {
                _this.ctx.save();
                _this.ctx.strokeStyle = _this.style.line.color.select;
                _this.ctx.fillStyle = _this.style.rect.color.select;
                _this.ctx.lineWidth = _this.style.line.width.select;
                _this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                _this.ctx.shadowOffsetX = 0;
                _this.ctx.shadowOffsetY = 2;
                _this.ctx.shadowBlur = 3;
            }
            _this.ctx.fillRect(
                item.x * _this.scale,
                item.y * _this.scale,
                item.width * _this.scale,
                item.height * _this.scale
            );
            _this.ctx.strokeRect(
                item.x * _this.scale,
                item.y * _this.scale,
                item.width * _this.scale,
                item.height * _this.scale
            );
            if (selectIndex === index) {
                _this.ctx.restore();
            }
            _this.drawCoordinate(item, index, selectedIndex, selectIndex);
        });

        _this.ctx.restore();
    }

    public drawCoordinate(item: Mark, index: number, selected: number, selectIndex: number): void {
        let verOffset = 4;
        let horOffset = 4;
        let str = `ID: ${item.id} - X: ${item.x} - Y: ${item.y} - Z: ${index} - W: ${item.width} - H: ${item.height}`;
        let scale = this.getScale();

        this.ctx.save();
        this.ctx.font = this.style.text.font;
        this.ctx.fillStyle = this.style.text.color.normal;
        this.ctx.fillRect(
            item.x * scale - 1,
            item.y * scale - 1,
            this.ctx.measureText(str).width + horOffset,
            -parseInt(this.style.text.font, 10) - verOffset
        );
        this.ctx.fillStyle = (selected && selectIndex === index) ? this.style.text.color.select : this.style.text.color.normal;
        this.ctx.fillText(str, item.x * scale, item.y * scale - verOffset);
        this.ctx.restore();
    }

    public redraw(markList: MarkList, selectedIndex?: number): void {
        this.clear();
        this.drawBackground();
        this.drawMarkList(markList, selectedIndex);
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

    private initialize(url, style) {
        this.image = new MarkImage(url);
        this.ctx = this.el.getContext('2d');
        this.style = style;
        this.scale = 1;
    }
}
