import { Marker } from './Marker';

export const EventHandler = {
    mouseDown(event, _this) {
        _this.action = _this.getMouseAction(event);
        let name = _this.action.name;
        let index = _this.action.index;
        let id = _this.action.id;
        let canvas = _this.canvas;
        let settings = _this.settings;
        switch (name) {
            case 'move':
                if (settings.draggable) {
                    _this.setEventType(name);
                    _this.setMarkSelectedById(id, event);
                    // _this.sortMarkList(index);
                    _this.renderList();
                    canvas.setStyle('cursor: move');
                    canvas.addEvent(_this, 'mousemove', 'move', Marker.eventHandler.selectMove);
                    canvas.addEvent(_this, 'mouseup', 'move', Marker.eventHandler.selectUp);
                }
                break;
            case 'scale':
                if (settings.scalable) {
                    _this.setEventType(name);
                    _this.selectIndex = _this.getSelectedMarkIndex();
                    _this.setMarkSelectedByIndex(index);
                    canvas.setStyle('cursor: move');
                    canvas.addEvent(_this, 'mousemove', 'scalemove', Marker.eventHandler.scaleMove);
                    canvas.addEvent(_this, 'mouseup', 'scaleup', Marker.eventHandler.scaleUp);
                }
                break;
            default:
                if (settings.creatable) {
                    _this.setEventType('default');
                    _this.setEventOrigin(event);
                    _this.clearMarkSelected();
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
        _this.setSelectMarkOffset(event);
        _this.renderList();
    },
    selectUp(event, _this) {
        // _this.setSelectMarkOffset(event);
        // _this.renderList();
        _this.setEventType('none');
        // _this.canvas.addEvent('mousemove', _this.activeMoveHandler);
        _this.canvas.removeEvent(_this, 'mousemove', 'move');
        _this.canvas.removeEvent(_this, 'mouseup', 'move');
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
