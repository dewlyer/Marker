import * as $ from 'jquery';
import { Mark } from './Mark';
import { MarkList } from './MarkList';
import { MarkCanvas } from './Canvas';
import { Defaults } from './Defaults';
import { EventHandler } from './Event';

export class Marker {
    public static eventHandler = EventHandler;
    private static defaults = Defaults;

    private markList: MarkList;
    private canvas: MarkCanvas;
    private settings: any;

    private zoom: number;
    private scaleZone: number;

    private selectedMark: Mark;
    private selectedOrigin: { x: number, y: number };
    private selectIndex: null;

    private action: any;
    private eventOrigin: { x: number, y: number };
    private eventType: string;

    public constructor(canvas: HTMLCanvasElement, imageUrl: string, options?: any) {
        this.settings = $.extend(Marker.defaults, options || {});
        this.canvas = new MarkCanvas(canvas, imageUrl, {
            line: {
                join: {
                    normal: this.settings.line.join,
                    active: this.settings.line.join,
                    select: this.settings.line.join
                },
                dash: {
                    normal: this.settings.line.dash,
                    active: this.settings.line.dash,
                    select: this.settings.line.dash
                },
                width: {
                    normal: this.settings.line.width,
                    active: this.settings.line.width,
                    select: this.settings.line.width
                },
                color: {
                    normal: this.settings.line.color.normal,
                    active: this.settings.line.color.active,
                    select: this.settings.line.color.select
                }
            },
            rect: {
                color: {
                    normal: this.settings.rect.color.normal,
                    active: this.settings.rect.color.active,
                    select: this.settings.rect.color.select
                }
            },
            text: {
                font: this.settings.text.font,
                bg: this.settings.text.color,
                color: {
                    normal: this.settings.line.color.normal,
                    select: this.settings.line.color.select
                }
            }
        });
        this.initialize();
    }

    public getMarkList() {
        let _this = this;
        return _this.markList.list;
    }

    public getSelectedMark() {
        let _this = this;
        let index = _this.getSelectedMarkIndex();
        if (index !== null) {
            return _this.markList.list[index];
        }
    }

    public setZoom(zoom: number): void {
        let scale;
        this.zoom = zoom;
        scale = this.canvas.getScale();
        scale *= this.zoom;
        this.canvas.setScale(scale);
        this.renderList();
    }

    public renderList() {
        this.canvas.redraw(this.markList);
    }

    public renderCreating() {
        let mark = this.getCurrent();
        this.canvas.drawCreatingMark(mark);
    }

    public run(callback: () => void): void {
        let _this = this;
        this.canvas.ready(() => {
            _this.renderList();
            _this.handleEvent();
            _this.initData();
            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    public setEventType(type) {
        this.eventType = type;
    }

    public setEventOrigin(event) {
        let _this = this;
        _this.eventOrigin = _this.getEventPosition(event);
    }

    public clearCurrentMark() {
        let itemIndex = this.getSelectedMarkIndex();
        let id;
        if (itemIndex !== null && (this.eventType === 'none' || this.eventType === 'default')) {
            id = this.markList.getItemById(itemIndex).id;
            this.clearMark(id);
            this.removeEvent();
        }
    }

    public clear() {
        if (this.eventType === 'none' || this.eventType === 'default') {
            this.clearMarkList();
            this.renderList();
        }
    }

    public getCurrent() {
        return this.markList.current;
    }

    public setCurrent(event: MouseEvent) {
        let point = this.getEventPosition(event);
        let [x, y, width, height, id] = [0, 0, 0, 0, this.markList.list.length.toString()];

        if (point.x >= this.eventOrigin.x) {
            x = this.eventOrigin.x;
            width = point.x - this.eventOrigin.x;
        } else {
            x = point.x;
            width = this.eventOrigin.x - point.x;
        }

        if (point.y >= this.eventOrigin.y) {
            y = this.eventOrigin.y;
            height = point.y - this.eventOrigin.y;
        } else {
            y = point.y;
            height = this.eventOrigin.y - point.y;
        }

        this.markList.current = new Mark(id, x, y, width, height);
    }

    private addCurrentToList() {
        let _this = this;
        _this.markList.list.push(_this.markList.current);
    }

    private getMarkIndexById(id) {
        let _this = this,
            index = null;

        _this.markList.list.every(function (item, i) {
            if (item.id === id) {
                index = i;
                return false;
            } else {
                return true;
            }
        });

        return index;
    }

    private getSelectedMarkIndex() {
        if (!!this.selectedMark && typeof this.selectedMark.id !== 'undefined') {
            return this.getMarkIndexById(this.selectedMark.id);
        } else {
            return null;
        }
    }

    private setMarkSelectedById(id, event) {
        let position = this.getEventPosition(event);
        $.each(this.markList.list, function (index, item) {
            if (id === item.id) {
                item.select();
                item.saveOrigin();
                item.saveSelectPosition(position);
            }
        });
    }

    private setMarkSelectedByIndex(index) {
        let _this = this;
        let selectItem = _this.markList.list[index];
        _this.selectedOrigin = _this.getEventPosition(event);
        _this.selectedMark = selectItem;
        // {
        //     id: selectItem.id,
        //     width: selectItem.width,
        //     height: selectItem.height,
        //     x: selectItem.x,
        //     y: selectItem.y
        // };
    }

    private clearMarkSelected() {
        $.each(this.markList.list, function (index, item) {
            item.unselect();
        });
    }

    private setMarkList(list) {
        let _this = this;
        _this.markList.list = list;
    }

    private sortMarkList(index) {
        let _this = this;
        let selectedMark = _this.markList.list[index];
        _this.markList.list.splice(index, 1);
        _this.markList.list.push(selectedMark);
    }

    private setSelectMarkOffset(event) {
        let position = this.getEventPosition(event);
        $.each(this.markList.list, function (index, item) {
            if (item.isSelected()) {
                item.x = position.x + item.origin.x - item.selectPosition.x;
                item.y = position.y + item.origin.y - item.selectPosition.y;
            }
        });
    }

    private resizeSelectMark(event, direction) {
        let _this = this;
        let point = _this.getEventPosition(event);
        let ways = direction.split(',');

        $.each(this.markList.list, function (index, item) {
            let offsetW, offsetH;
            if (item.isSelected()) {
                offsetW = point.x - item.selectPosition.x;
                offsetH = point.y - item.selectPosition.y;
                $.each(ways, function (i, way) {
                    if (way === 'left') {
                        if (offsetW <= 0 || item.width >= 2 * _this.scaleZone) {
                            item.x = item.origin.x + offsetW;
                            item.width = item.origin.width - offsetW;
                        }
                    } else if (way === 'right') {
                        if (offsetW >= 0 || item.width >= 2 * _this.scaleZone) {
                            item.width = item.origin.width + offsetW;
                        }
                    } else if (way === 'top') {
                        if (offsetH <= 0 || item.height > 2 * _this.scaleZone) {
                            item.y = item.origin.y + offsetH;
                            item.height = item.origin.height - offsetH;
                        }
                    } else if (way === 'bottom') {
                        if (offsetH >= 0 || item.height >= 2 * _this.scaleZone) {
                            item.height = item.origin.height + offsetH;
                        }
                    }
                });
            }
        });
    }

    private getMouseAction(event) {
        let _this = this;
        let action = {name: 'append', index: 0, id: '', direction: ''};
        let point = _this.getEventPosition(event);
        // let itemIndex = _this.getSelectedMarkIndex();

        $.each(this.markList.list, function (index, item) {
            let x1 = item.x, x2 = item.x + item.width,
                y1 = item.y, y2 = item.y + item.height;
            if (point.x >= x1 && point.x <= x2 && point.y >= y1 && point.y <= y2) {
                action.id = item.id;
                action.index = index;
                action.name = 'scale';
                if (item.isSelected()) {
                    if (point.x <= x1 + _this.scaleZone) {
                        if (point.y <= y1 + _this.scaleZone) {
                            action.direction = 'left,top';
                        } else if (point.y >= y2 - _this.scaleZone) {
                            action.direction = 'left,bottom';
                        } else {
                            action.direction = 'left';
                        }
                    } else if (point.x >= x2 - _this.scaleZone) {
                        if (point.y <= y1 + _this.scaleZone) {
                            action.direction = 'right,top';
                        } else if (point.y >= y2 - _this.scaleZone) {
                            action.direction = 'right,bottom';
                        } else {
                            action.direction = 'right';
                        }
                    } else if (point.y <= y1 + _this.scaleZone) {
                        action.direction = 'top';
                    } else if (point.y >= y2 - _this.scaleZone) {
                        action.direction = 'bottom';
                    } else {
                        action.name = 'move';
                    }
                } else {
                    action.name = 'move';
                }
            }
        });

        // if (_this.markList.list.length > 0) {
        //     _this.markList.list.forEach(function (item, index) {
        //     });
        // }

        return action;
    }


    private getEventPosition(event) {
        let scale = this.canvas.getScale();
        return {
            x: event.pageX / scale,
            y: event.pageY / scale
        };
    }

    private isMarkCreatable(event) {
        let point = this.getEventPosition(event);
        let width = Math.abs(point.x - this.eventOrigin.x);
        let height = Math.abs(point.y - this.eventOrigin.y);
        return width > 2 * this.scaleZone && height > 2 * this.scaleZone;
    }


    private setCursorStyle(event) {
        let _this = this;
        if (this.markList.list.length <= 0) {
            return;
        }

        let point = this.getEventPosition(event);
        // let item = this.markList.list[itemIndex];
        $.each(this.markList.list, function (index, item) {
            let style = 'cursor: move;';
            let x1 = item.x, x2 = item.x + item.width,
                y1 = item.y, y2 = item.y + item.height;

            if (point.x >= x1 && point.x <= x2 && point.y >= y1 && point.y <= y2) {
                if (point.x <= x1 + _this.scaleZone) {
                    if (point.y <= y1 + _this.scaleZone) {
                        style = 'cursor: nw-resize;';
                    } else if (point.y >= y2 - _this.scaleZone) {
                        style = 'cursor: sw-resize;';
                    } else {
                        style = 'cursor: w-resize;';
                    }
                } else if (point.x >= x2 - _this.scaleZone) {
                    if (point.y <= y1 + _this.scaleZone) {
                        style = 'cursor: ne-resize;';
                    } else if (point.y >= y2 - _this.scaleZone) {
                        style = 'cursor: se-resize;';
                    } else {
                        style = 'cursor: e-resize;';
                    }
                } else if (point.y <= y1 + _this.scaleZone) {
                    style = 'cursor: n-resize;';
                } else if (point.y >= y2 - _this.scaleZone) {
                    style = 'cursor: s-resize;';
                } else {
                    style = 'cursor: move;';
                }
            } else {
                style = 'cursor: default;';
            }

            _this.canvas.setStyle(style);
        });
    }


    // events
    private handleEvent() {
        this.canvas.addEvent(this, 'mousedown', 'start', Marker.eventHandler.mouseDown);
    }

    private removeEvent() {
        this.canvas.removeEvent(this, 'mousemove', 'start');
    }

    // clear

    private clearMarkList(): void {
        this.markList.list = [];
    }

    private clearMark(id: string): void {
        let index = this.getMarkIndexById(id);
        if (index !== null) {
            this.markList.list.splice(index, 1);
            this.renderList();
        }
    }

    // init

    private initData(): void {
        if (this.settings.data && this.settings.data.length > 0) {
            this.markList = this.settings.data;
            this.renderList();
        }
    }

    private initialize(): void {
        this.scaleZone = 10;
        this.zoom = 1;
        this.eventOrigin = {x: 0, y: 0};
        this.markList = new MarkList([]);
        this.selectedMark = null;
        this.eventType = 'none';
    }
}
