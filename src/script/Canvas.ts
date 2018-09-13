import * as $ from 'jquery';
import { ImageSize, MarkImage } from './Image';
import { MarkList } from './MarkList';
import { Mark } from './Mark';

export class MarkCanvas {
    private ctx: CanvasRenderingContext2D;
    private image: MarkImage;
    private size: ImageSize;
    private scale: number;

    public constructor(private el: HTMLCanvasElement, url: string, private style: any) {
        this.initialize(url);
    }

    public getScale(): number {
        return this.scale;
    }

    public setScale(scale: number): void {
        this.scale = scale;
    }

    public setSize(size: ImageSize) {
        this.size = size;
    }

    public setElSize() {
        this.el.width = this.size.width * this.scale;
        this.el.height = this.size.height * this.scale;
    }

    public setStyle(style) {
        this.el.setAttribute('style', style);
    }

    public addEvent(scope, type, namespace, listener) {
        $(this.el).on(type + '.' + namespace, (e) => {
            if (e.button === 0) {
                listener(e, scope);
            }
        });
    }

    public removeEvent(scope, type, namespace) {
        $(this.el).off(type + '.' + namespace);
    }

    // draw

    public drawBackground(): void {
        this.ctx.drawImage(this.image.getElement(), 0, 0, this.size.width, this.size.height);
    }

    public drawCreatingMark(current: Mark): void {
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
        this.ctx.fillStyle = this.style.text.bg;
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
        this.ctx.clearRect(0, 0, this.size.width, this.size.height);
    }

    public ready(callback) {
        let _this = this;
        this.image.loadComplete(() => {
            if (_this.image.hasSource()) {
                let size = this.image.getSize();
                this.setSize(size);
                this.setElSize();
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
        this.size = {width: 0, height: 0};
        this.scale = 1;
    }
}
