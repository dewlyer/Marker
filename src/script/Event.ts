import { Marker } from './Marker';

export const EventHandler = {
    mouseDown(event, _this) {
        _this.action = _this.getMouseAction(event);
        let name = _this.action.name;
        let index = _this.action.index;
        let canvas = _this.canvas;
        switch (name) {
            case 'move':
                _this.cursorEvent = name;
                canvas.setStyle('cursor: move');
                _this.setSelectedMark(index);
                _this.sortMarkList(index);
                _this.selectIndex = _this.getSelectedMarkIndex();
                canvas.redraw(_this.markList, _this.selectIndex);
                canvas.addEvent(_this, 'mousemove', 'selectmove', Marker.eventHandler.selectMove);
                canvas.addEvent(_this, 'mouseup', 'selectup', Marker.eventHandler.selectUp);
                break;
            case 'scale':
                _this.cursorEvent = name;
                canvas.setStyle('cursor: move');
                _this.setSelectedMark(index);
                _this.selectIndex = _this.getSelectedMarkIndex();
                canvas.addEvent(_this, 'mousemove', 'scalemove', Marker.eventHandler.scaleMove);
                canvas.addEvent(_this, 'mouseup', 'scaleup', Marker.eventHandler.scaleUp);
                break;
            default:
                // append rect
                _this.cursorEvent = 'none';
                canvas.setStyle('cursor: default');
                _this.setOriginPoint(event);
                _this.clearSelectedMark();
                canvas.addEvent(_this, 'mousemove', 'mousemove', Marker.eventHandler.mouseMove);
                canvas.addEvent(_this, 'mouseup', 'mouseup', Marker.eventHandler.mouseUp);
        }
    },
    mouseMove(event, _this) {
        _this.setCurrent(event);
        _this.render();
        _this.renderCreating();
    },
    mouseUp(event, _this) {
        _this.canCreateMark(event, function () {
            _this.setCurrent(event);
            _this.addMark();
        }, function () {
            alert('所选区域太小，请重现选取！');
        });
        _this.canvas.redraw(_this.markList);
        _this.canvas.removeEvent(_this, 'mousemove', 'mousemove');
        _this.canvas.removeEvent(_this, 'mouseup', 'mouseup');
    },
    selectMove(event, _this) {
        // selectIndex = _this.getSelectedMarkIndex();
        _this.setMarkOffset(event, _this.selectIndex);
        _this.canvas.redraw(_this.markList, _this.selectIndex);
    },
    selectUp(event, _this) {
        // selectIndex = _this.getSelectedMarkIndex();
        _this.setMarkOffset(event, _this.selectIndex);
        _this.canvas.redraw(_this.markList, _this.selectIndex);

        // _this.canvas.addEvent('mousemove', _this.activeMoveHandler);
        _this.canvas.removeEvent(_this, 'mousemove', 'selectmove');
        _this.canvas.removeEvent(_this, 'mouseup', 'selectup');
        _this.cursorEvent = 'none';
    },
    scaleMove(event, _this) {
        // selectIndex = _this.getSelectedMarkIndex();
        _this.resizeMark(event, _this.selectIndex, _this.action.direction);
        _this.canvas.redraw(_this.markList, _this.selectIndex);
    },
    scaleUp(event, _this) {
        _this.canvas.redraw(_this.markList, _this.selectIndex);
        _this.canvas.addEvent(_this, 'mousemove', 'scalemove', Marker.eventHandler.scaleMove);
        _this.canvas.addEvent(_this, 'mouseup', 'scaleup', Marker.eventHandler.scaleUp);
        _this.cursorEvent = 'none';
    },
    activeMove(event, _this) {
        // selectIndex = _this.getSelectedMarkIndex();
        _this.setCursorStyle(event, _this.selectIndex);
    }
};
