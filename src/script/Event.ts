import { Marker } from './Marker';

export const EventHandler = {
    mouseDown(event, _this) {
        _this.action = _this.getMouseAction(event);
        // let index = _this.action.index;
        let name = _this.action.name;
        let id = _this.action.id;
        let canvas = _this.canvas;
        let settings = _this.settings;
        switch (name) {
            case 'move':
                if (settings.draggable) {
                    _this.setEventType(name);
                    _this.clearMarkSelected();
                    canvas.removeEvent(_this, 'mousemove', 'active');
                    _this.setMarkSelectedById(id, event);
                    _this.setGroupCheckedByClick(id);
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
                    _this.setMarkSelectedById(id, event);
                    // _this.setMarkSelectedByIndex(index);
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
                    canvas.removeEvent(_this, 'mousemove', 'active');
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
        _this.canvas.removeEvent(_this, 'mousemove', 'move');
        _this.canvas.removeEvent(_this, 'mouseup', 'move');

        _this.canvas.addEvent(_this, 'mousemove', 'active', Marker.eventHandler.activeMove);
    },
    scaleMove(event, _this) {
        _this.resizeSelectMark(event, _this.action.direction);
        _this.renderList();
    },
    scaleUp(event, _this) {
        _this.eventType = 'none';
        _this.canvas.removeEvent(_this, 'mousemove', 'scalemove');
        _this.canvas.removeEvent(_this, 'mouseup', 'scaleup');
    },
    activeMove(event, _this) {
        _this.setCursorStyle(event);
    }
};
