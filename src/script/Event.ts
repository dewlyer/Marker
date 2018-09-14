import { Marker } from './Marker';

export const EventHandler = {
    mouseDown(event, _this) {
        _this.action = _this.getMouseAction(event);
        let name = _this.action.name;
        let index = _this.action.index;
        let canvas = _this.canvas;
        let settings = _this.settings;
        switch (name) {
            case 'move':
                if (settings.draggable) {
                    _this.setEventType(name);
                    _this.selectIndex = _this.getSelectedMarkIndex();
                    _this.setSelectedMark(index);
                    _this.sortMarkList(index);
                    canvas.setStyle('cursor: move');
                    canvas.redraw(_this.markList, _this.selectIndex);
                    canvas.addEvent(_this, 'mousemove', 'selectmove', Marker.eventHandler.selectMove);
                    canvas.addEvent(_this, 'mouseup', 'selectup', Marker.eventHandler.selectUp);
                }
                break;
            case 'scale':
                if (settings.scalable) {
                    _this.setEventType(name);
                    _this.selectIndex = _this.getSelectedMarkIndex();
                    _this.setSelectedMark(index);
                    canvas.setStyle('cursor: move');
                    canvas.addEvent(_this, 'mousemove', 'scalemove', Marker.eventHandler.scaleMove);
                    canvas.addEvent(_this, 'mouseup', 'scaleup', Marker.eventHandler.scaleUp);
                }
                break;
            default:
                if (settings.creatable) {
                    _this.setEventType('default');
                    _this.setEventOrigin(event);
                    // _this.clearSelectedMark();
                    canvas.setStyle('cursor: default');
                    canvas.addEvent(_this, 'mousemove', 'create', Marker.eventHandler.mouseMove);
                    canvas.addEvent(_this, 'mouseup', 'create', Marker.eventHandler.mouseUp);
                }
        }
    },

    mouseMove(event, _this) {
        _this.setCurrent(event);
        _this.renderList();
        _this.renderCreating();
    },
    mouseUp(event, _this) {
        if (_this.isMarkCreatable(event)) {
            _this.setCurrent(event);
            _this.addCurrentToList();
        } else {
            alert('所选区域太小，请重现选取！');
        }
        _this.renderList();
        _this.canvas.removeEvent(_this, 'mousemove', 'create');
        _this.canvas.removeEvent(_this, 'mouseup', 'create');
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
        _this.eventType = 'none';
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
        _this.eventType = 'none';
    },

    activeMove(event, _this) {
        // selectIndex = _this.getSelectedMarkIndex();
        _this.setCursorStyle(event, _this.selectIndex);
    }
};
