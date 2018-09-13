import * as _ from 'lodash';
import * as $ from 'jquery';
import { Mark } from './Mark';
import { MarkList } from './MarkList';
import { MarkCanvas } from './Canvas';
import { Defaults } from './Defaults';

export class Marker {
    private static defaults = Defaults;

    private markList: MarkList;
    private canvas: MarkCanvas;
    private origin: { x: number, y: number };
    private scale: { size: number, zoom: number };
    private cursorEvent: string;
    private settings: any;
    private selectedMark: Mark;
    private selectedOrigin: { x: number, y: number };


    private selectIndex: null;
    private action: any;

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

    public setCanvasScale(zoom: number): void {
        let scale = this.canvas.getScale();
        scale *= zoom;
        this.canvas.setScale(scale);
        this.canvas.redraw(this.markList);
    }

    public run(callback: () => void): void {
        let _this = this;
        this.canvas.ready(() => {
            _this.canvas.drawBackground();
            _this.handleEvent();
            _this.initData();
            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    public clearCurrentMark() {
        let itemIndex = this.getSelectedMarkIndex();
        let id;
        if (itemIndex !== null && this.cursorEvent === 'none') {
            id = this.markList.getItemById(itemIndex).id;
            this.clearMark(id);
            this.canvas.removeEvent(this, 'mousemove', 'mousemove', this.mouseMoveHandler);
        }
    }

    public clear() {
        if (this.cursorEvent === 'none') {
            this.clearMarkList();
            this.canvas.redraw(this.markList);
        }
    }

    public getCurrentMark() {
        return this.markList.current;
    }

    public setCurrentMark(event: MouseEvent) {
        let point = this.getEventPosition(event);
        let [x, y, width, height, id] = [0, 0, 0, 0, this.markList.list.length.toString()];

        if (point.x >= this.origin.x) {
            x = this.origin.x;
            width = point.x - this.origin.x;
        } else {
            x = point.x;
            width = this.origin.x - point.x;
        }

        if (point.y >= this.origin.y) {
            y = this.origin.y;
            height = point.y - this.origin.y;
        } else {
            y = point.y;
            height = this.origin.y - point.y;
        }

        this.markList.current = new Mark(id, x, y, width, height);
    }

    private addMark() {
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

    private setSelectedMark(index) {
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

    private setMarkOffset(event, itemIndex) {
        let _this = this;
        let position = _this.getEventPosition(event);
        let offsetX = position.x - _this.selectedOrigin.x;
        let offsetY = position.y - _this.selectedOrigin.y;
        _this.markList.list[itemIndex].x = _this.selectedMark.x + offsetX;
        _this.markList.list[itemIndex].y = _this.selectedMark.y + offsetY;
    }

    private resizeMark(event, itemIndex, direction) {
        let _this = this;
        let point = _this.getEventPosition(event);
        let offsetW = point.x - _this.selectedOrigin.x;
        let offsetH = point.y - _this.selectedOrigin.y;

        let ways = direction.split(',');
        ways.forEach(function (item) {
            if (item === 'left') {
                if (offsetW <= 0 || _this.markList.list[itemIndex].width >= 2 * _this.scale.size) {
                    _this.markList.list[itemIndex].x = _this.selectedMark.x + offsetW;
                    _this.markList.list[itemIndex].width = _this.selectedMark.width - offsetW;
                }
            } else if (item === 'right') {
                if (offsetW >= 0 || _this.markList.list[itemIndex].width >= 2 * _this.scale.size) {
                    _this.markList.list[itemIndex].width = _this.selectedMark.width + offsetW;
                }
            } else if (item === 'top') {
                if (offsetH <= 0 || _this.markList.list[itemIndex].height > 2 * _this.scale.size) {
                    _this.markList.list[itemIndex].y = _this.selectedMark.y + offsetH;
                    _this.markList.list[itemIndex].height = _this.selectedMark.height - offsetH;
                }
            } else if (item === 'bottom') {
                if (offsetH >= 0 || _this.markList.list[itemIndex].height >= 2 * _this.scale.size) {
                    _this.markList.list[itemIndex].height = _this.selectedMark.height + offsetH;
                }
            }
        });
    }

    private getMouseAction(event) {
        let _this = this;
        let action = {name: 'append', index: 0, direction: ''};
        let point = _this.getEventPosition(event);
        let itemIndex = _this.getSelectedMarkIndex();

        if (_this.markList.list.length > 0) {
            _this.markList.list.forEach(function (item, index) {
                let x1 = item.x, x2 = item.x + item.width,
                    y1 = item.y, y2 = item.y + item.height;
                if (point.x >= x1 && point.x <= x2 && point.y >= y1 && point.y <= y2) {
                    action.index = index;
                    action.name = 'scale';
                    if (index === itemIndex) {
                        if (point.x <= x1 + _this.scale.size) {
                            if (point.y <= y1 + _this.scale.size) {
                                action.direction = 'left,top';
                            } else if (point.y >= y2 - _this.scale.size) {
                                action.direction = 'left,bottom';
                            } else {
                                action.direction = 'left';
                            }
                        } else if (point.x >= x2 - _this.scale.size) {
                            if (point.y <= y1 + _this.scale.size) {
                                action.direction = 'right,top';
                            } else if (point.y >= y2 - _this.scale.size) {
                                action.direction = 'right,bottom';
                            } else {
                                action.direction = 'right';
                            }
                        } else if (point.y <= y1 + _this.scale.size) {
                            action.direction = 'top';
                        } else if (point.y >= y2 - _this.scale.size) {
                            action.direction = 'bottom';
                        } else {
                            action.name = 'move';
                        }
                    } else {
                        action.name = 'move';
                    }
                }
            });
        }

        return action;
    }

    private getEventPosition(event) {
        let _this = this;
        return {
            x: (event.x + window.scrollX) / _this.scale.zoom,
            y: (event.y + window.scrollY) / _this.scale.zoom
        };
    }

    private canAppendMark(event, success, failure) {
        let _this = this;
        let point = _this.getEventPosition(event);
        let width = Math.abs(point.x - _this.origin.x);
        let height = Math.abs(point.y - _this.origin.y);
        if (width > 2 * _this.scale.size && height > 2 * _this.scale.size) {
            if (typeof success === 'function') {
                success();
            }
        } else {
            if (typeof failure === 'function') {
                failure();
            }
        }
    }

    private setOriginPoint(event) {
        let _this = this;
        _this.origin = _this.getEventPosition(event);
    }

    private setCursorStyle(event, itemIndex) {
        let _this = this;
        if (_this.markList.list.length <= 0) {
            return;
        }

        let point = _this.getEventPosition(event);
        let item = _this.markList.list[itemIndex];
        let style = 'cursor: move;';
        let x1 = item.x, x2 = item.x + item.width,
            y1 = item.y, y2 = item.y + item.height;

        if (point.x >= x1 && point.x <= x2 && point.y >= y1 && point.y <= y2) {
            if (point.x <= x1 + _this.scale.size) {
                if (point.y <= y1 + _this.scale.size) {
                    style = 'cursor: nw-resize;';
                } else if (point.y >= y2 - _this.scale.size) {
                    style = 'cursor: sw-resize;';
                } else {
                    style = 'cursor: w-resize;';
                }
            } else if (point.x >= x2 - _this.scale.size) {
                if (point.y <= y1 + _this.scale.size) {
                    style = 'cursor: ne-resize;';
                } else if (point.y >= y2 - _this.scale.size) {
                    style = 'cursor: se-resize;';
                } else {
                    style = 'cursor: e-resize;';
                }
            } else if (point.y <= y1 + _this.scale.size) {
                style = 'cursor: n-resize;';
            } else if (point.y >= y2 - _this.scale.size) {
                style = 'cursor: s-resize;';
            } else {
                style = 'cursor: move;';
            }
        } else {
            style = 'cursor: default;';
        }

        _this.canvas.setStyle(style);
    }

    // events

    private mouseDownHandler(e, _this) {
        if (e.button !== 0) {
            return;
        }
        _this.action = _this.getMouseAction(e);
        if (_this.action.name === 'move') {
            _this.cursorEvent = 'move';
            _this.canvas.setStyle('cursor: move');
            _this.setSelectedMark(_this.action.index);
            _this.sortMarkList(_this.action.index);
            _this.selectIndex = _this.getSelectedMarkIndex();
            _this.canvas.redraw(_this.markList, _this.selectIndex);
            _this.canvas.addEvent(_this, 'mousemove', 'selectmove', _this.selectMoveHandler);
            _this.canvas.addEvent(_this, 'mouseup', 'selectup', _this.selectUpHandler);
        } else if (_this.action.name === 'scale') {
            _this.cursorEvent = 'scale';
            _this.canvas.setStyle('cursor: move');
            _this.setSelectedMark(_this.action.index);
            _this.selectIndex = _this.getSelectedMarkIndex();
            _this.canvas.addEvent(_this, 'ousemove', 'scalemove', _this.scaleMoveHandler);
            _this.canvas.addEvent(_this, 'mouseup', 'scaleup', _this.scaleUpHandler);
        } else {
            // append rect
            _this.cursorEvent = 'none';
            _this.canvas.setStyle('cursor: default');
            _this.setOriginPoint(e);
            _this.clearSelectedMark();

            _this.canvas.addEvent(_this, 'ousemove', 'mousemove', _this.mouseMoveHandler);
            _this.canvas.addEvent(_this, 'mouseup', 'mouseup', _this.mouseUpHandler);
        }
    }

    private mouseMoveHandler(e, _this) {
        _this.setCurrentMark(e);
        _this.canvas.redraw(_this.markList);
        _this.canvas.drawCurrentMark(_this.getCurrentMark());
    }

    private mouseUpHandler(e, _this) {
        if (e.button !== 0) {
            return;
        }
        _this.canAppendMark(e, function () {
            _this.setCurrentMark(e);
            _this.addMark();
        }, function () {
            // alert('所选区域太小，请重现选取！');
        });
        _this.canvas.redraw(_this.markList);
        _this.canvas.removeEvent(_this, 'mousemove', 'mousemove', _this.mouseMoveHandler);
        _this.canvas.removeEvent(_this, 'mouseup', 'mouseup', _this.mouseUpHandler);
    }

    private selectMoveHandler(e, _this) {
        // selectIndex = _this.getSelectedMarkIndex();
        _this.setMarkOffset(e, _this.selectIndex);
        _this.canvas.redraw(_this.markList, _this.selectIndex);
    }

    private selectUpHandler(e, _this) {
        if (e.button !== 0) {
            return;
        }
        // selectIndex = _this.getSelectedMarkIndex();
        _this.setMarkOffset(e, _this.selectIndex);
        _this.canvas.redraw(_this.markList, _this.selectIndex);

        // _this.canvas.addEvent('mousemove', _this.activeMoveHandler);
        _this.canvas.removeEvent(_this, 'mousemove', 'selectmove', _this.selectMoveHandler);
        _this.canvas.removeEvent(_this, 'mouseup', 'selectup', _this.selectUpHandler);
        _this.cursorEvent = 'none';
    }

    private scaleMoveHandler(e, _this) {
        // selectIndex = _this.getSelectedMarkIndex();
        _this.resizeMark(e, _this.selectIndex, _this.action.direction);
        _this.canvas.redraw(_this.markList, _this.selectIndex);
    }

    private scaleUpHandler(e, _this) {
        if (e.button !== 0) {
            return;
        }
        _this.canvas.redraw(_this.markList, _this.selectIndex);
        _this.canvas.addEvent(_this, 'mousemove', 'scalemove', _this.scaleMoveHandler);
        _this.canvas.addEvent(_this, 'mouseup', 'scaleup', _this.scaleUpHandler);
        _this.cursorEvent = 'none';
    }

    private activeMoveHandler(e, _this) {
        // selectIndex = _this.getSelectedMarkIndex();
        _this.setCursorStyle(e, _this.selectIndex);
    }

    private handleEvent() {
        this.canvas.addEvent(this, 'mousedown', 'mousedown', this.mouseDownHandler);
    }

    // clear

    private clearMarkList(): void {
        this.markList.list = [];
    }

    private clearMark(id: string): void {
        let index = this.getMarkIndexById(id);
        if (index !== null) {
            this.markList.list.splice(index, 1);
            this.canvas.redraw(this.markList);
        }
    }

    private clearSelectedMark() {
        this.selectedMark = null;
    }

    // init

    private initData(): void {
        if (this.settings.data && this.settings.data.length > 0) {
            this.markList = this.settings.data;
            this.canvas.redraw(this.markList);
        }
    }

    private initialize(): void {
        this.scale = {size: 10, zoom: 1};
        this.origin = {x: 0, y: 0};
        this.markList = new MarkList([]);
        this.selectedMark = null;
    }
}
