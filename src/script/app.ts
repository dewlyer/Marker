// import bg from '../images/bg.jpg';
import '../style/app.scss';
import * as $ from 'jquery';
import { Marker as PaperMarker } from './Marker';

const AnswerList = 'ABCD';
const pageData = [
    // 第1题
    {x: 201, y: 595, width: 27, height: 16, groupId: '001', checked: true},
    {x: 233, y: 595, width: 27, height: 16, groupId: '001', checked: true},
    {x: 265, y: 595, width: 27, height: 16, groupId: '001', checked: true},
    {x: 297, y: 595, width: 27, height: 16, groupId: '001', checked: true},
    // 第2题
    {x: 201, y: 616, width: 27, height: 16, groupId: '002'},
    {x: 233, y: 616, width: 27, height: 16, groupId: '002'},
    {x: 265, y: 616, width: 27, height: 16, groupId: '002'},
    {x: 297, y: 616, width: 27, height: 16, groupId: '002', checked: true},
    // 第3题
    {x: 201, y: 637, width: 27, height: 16, groupId: '003'},
    {x: 233, y: 637, width: 27, height: 16, groupId: '003', checked: true},
    {x: 265, y: 637, width: 27, height: 16, groupId: '003'},
    {x: 297, y: 637, width: 27, height: 16, groupId: '003'},
    // 第4题
    {x: 361, y: 595, width: 27, height: 16, groupId: '004', checked: true},
    {x: 393, y: 595, width: 27, height: 16, groupId: '004'},
    {x: 425, y: 595, width: 27, height: 16, groupId: '004'},
    {x: 457, y: 595, width: 27, height: 16, groupId: '004'},
    // 第5题
    {x: 361, y: 616, width: 27, height: 16, groupId: '005'},
    {x: 393, y: 616, width: 27, height: 16, groupId: '005'},
    {x: 425, y: 616, width: 27, height: 16, groupId: '005'},
    {x: 457, y: 616, width: 27, height: 16, groupId: '005', checked: true},
    // 第6题
    {x: 361, y: 637, width: 27, height: 16, groupId: '006'},
    {x: 393, y: 637, width: 27, height: 16, groupId: '006'},
    {x: 425, y: 637, width: 27, height: 16, groupId: '006', checked: true},
    {x: 457, y: 637, width: 27, height: 16, groupId: '006'},
    // 第7题
    {x: 519, y: 595, width: 27, height: 16, groupId: '007', checked: true},
    {x: 551, y: 595, width: 27, height: 16, groupId: '007'},
    {x: 583, y: 595, width: 27, height: 16, groupId: '007'},
    {x: 615, y: 595, width: 27, height: 16, groupId: '007'},
    // 第8题
    {x: 519, y: 616, width: 27, height: 16, groupId: '008'},
    {x: 551, y: 616, width: 27, height: 16, groupId: '008', checked: true},
    {x: 583, y: 616, width: 27, height: 16, groupId: '008'},
    {x: 615, y: 616, width: 27, height: 16, groupId: '008'},
    // 第9题
    {x: 519, y: 637, width: 27, height: 16, groupId: '009'},
    {x: 551, y: 637, width: 27, height: 16, groupId: '009'},
    {x: 583, y: 637, width: 27, height: 16, groupId: '009', checked: true},
    {x: 615, y: 637, width: 27, height: 16, groupId: '009'},
    // 第10题
    {x: 677, y: 595, width: 27, height: 16, groupId: '010'},
    {x: 709, y: 595, width: 27, height: 16, groupId: '010'},
    {x: 741, y: 595, width: 27, height: 16, groupId: '010'},
    {x: 773, y: 595, width: 27, height: 16, groupId: '010', checked: true},
    // 第11题
    {x: 677, y: 616, width: 27, height: 16, groupId: '011'},
    {x: 709, y: 616, width: 27, height: 16, groupId: '011', checked: true},
    {x: 741, y: 616, width: 27, height: 16, groupId: '011'},
    {x: 773, y: 616, width: 27, height: 16, groupId: '011'},
    // 第12题
    {x: 677, y: 637, width: 27, height: 16, groupId: '012'},
    {x: 709, y: 637, width: 27, height: 16, groupId: '012'},
    {x: 741, y: 637, width: 27, height: 16, groupId: '012', checked: true},
    {x: 773, y: 637, width: 27, height: 16, groupId: '012'},
];

let Zoom = {
    level: [0.25, 0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2],
    index: 4
};

function setCanvasPosition(position: { x: number, y: number }): void {
    let $container = $('#container');
    // $('#canvas').css({
    //     left: $container.width() / 2 - position.x,
    //     top: $container.height() / 2 - position.y
    // });
    $('#canvas').animate({
        left: $container.width() / 2 - position.x,
        top: $container.height() / 2 - position.y
    }, '300');
}

function updateDraggingPosition(coords, x, y) {
    let $target = $('#canvas');
    let left: number = parseInt($target.css('left'), 10);
    let top: number = parseInt($target.css('top'), 10);
    $target.css({
        left: left + x - coords.x,
        top: top + y - coords.y
    });
    coords.x = x;
    coords.y = y;
    return coords;
}

function initKeyboardShortcut(): void {
    $(document).on('keydown.shortcut', function (event) {
        if (event.ctrlKey || event.metaKey) {
            switch (event.keyCode) {
                case 65:
                    $('#selectAllRect').trigger('click');
                    event.preventDefault();
                    break;
                case 68:
                    $('#clearRectList').trigger('click');
                    event.preventDefault();
                    break;
                case 8:
                    $('#clearRectSelect').trigger('click');
                    event.preventDefault();
                    break;
                case 107:
                case 187:
                    $('#setRectScaleUp').trigger('click');
                    event.preventDefault();
                    break;
                case 109:
                case 189:
                    $('#setRectScaleDown').trigger('click');
                    event.preventDefault();
                    break;
                case 79:
                    $('#getRectListInfo').trigger('click');
                    event.preventDefault();
                    break;
                case 73:
                    $('#getRectSelectInfo').trigger('click');
                    event.preventDefault();
                    break;
                case 82:
                    $('#redo').trigger('click');
                    event.preventDefault();
                    break;
                case 90:
                    $('#undo').trigger('click');
                    event.preventDefault();
                    break;
            }
        }
    });
}

function initKeyboardMove(callback: Function): void {
    $(document).on('keydown.move', function (event) {
        let offset = {x: 0, y: 0};
        switch (event.keyCode) {
            case 37:
                offset.x = -1; // 左
                break;
            case 38:
                offset.y = -1; // 上
                break;
            case 39:
                offset.x = 1; // 右
                break;
            case 40:
                offset.y = 1; // 下
                break;
        }
        callback(offset);
    });
}

function initAnswerListEvent(paperMarker: PaperMarker): void {
    $('.answer-list')
        .on('focus', 'input', function () {
            let $this = $(this);
            let input = <HTMLInputElement> $this.get(0);
            let groupId = $this.data('group-id');
            input.select();
            // paperMarker.setGroupSelectedByCheck(groupId);
            paperMarker.clearMarkSelected();
            paperMarker.renderList();
            setCanvasPosition(paperMarker.getGroupCenterPosition(groupId));
            $this.parent('li').addClass('active')
                .siblings().removeClass('active');
        })
        .on('input', 'input', function () {
            let $this = $(this);
            let groupId = $this.data('group-id');
            let strArr = $this.val().toString().toUpperCase().split('');
            let indexArr: Array<number> = [];
            $.each(strArr, function (i, str) {
                let index = AnswerList.indexOf(str);
                if (index !== -1) {
                    indexArr.push(index);
                } else {
                    window.alert('答案输入有误！');
                }
            });
            if (indexArr.length) {
                // paperMarker.setGroupSelectedByCheck(groupId);
                paperMarker.clearMarkSelected();
                paperMarker.setGroupChecked(groupId, indexArr);
                paperMarker.renderList();
            }
            $this.val($this.val().toString().toUpperCase());
        });
}

$(window).on('load', (): void => {
    let canvas = $('#canvas');
    let imageUrl = canvas.data('img');
    let paperMarker: PaperMarker;
    let events: object;
    let dragCoords = null;
    let option = {
        container: '#container',
        data: pageData,
        afterCheck: (groupId, indexArr) => {
            let answer = '';
            indexArr.sort();
            $.each(indexArr, function (index, item) {
                answer += AnswerList[item];
            });
            $('.answer-list').find('input')
                .filter(function () {
                    return $(this).data('group-id') === groupId;
                })
                .val(answer)
                .parent('li').addClass('active')
                .siblings().removeClass('active');
        },
        startDrag: (x, y) => {
            if (dragCoords === null) {
                dragCoords = {x: x, y: y};
            }
            dragCoords = updateDraggingPosition(dragCoords, x, y);
            // console.log(x, y);
        },
        endDrag: () => {
            dragCoords = null;
        }
    };

    paperMarker = new PaperMarker(<HTMLCanvasElement> canvas.get(0), imageUrl, option);

    events = {
        undo(e: HTMLElementEventMap['click']): void {
            paperMarker.undo();
        },
        redo(e: HTMLElementEventMap['click']): void {
            paperMarker.redo();
        },
        selectAllRect(e: HTMLElementEventMap['click']): void {
            paperMarker.setMarkSelectedAll();
            paperMarker.renderList();
        },
        clearRectList(e: HTMLElementEventMap['click']): void {
            paperMarker.clear();
        },
        clearRectSelect(e: HTMLElementEventMap['click']): void {
            paperMarker.clearSelectedMark();
            paperMarker.renderList();
        },
        getRectListInfo(e: HTMLElementEventMap['click']): void {
            console.log(e);
            let rectList = paperMarker.getMarkList();
            if (rectList.length > 0) {
                console.log(rectList);
                window.alert(JSON.stringify(rectList));
            } else {
                window.alert('没有可输出的信息');
            }
        },
        getRectSelectInfo(e: HTMLElementEventMap['click']): void {
            console.log(e);
            let selectRectList = paperMarker.getSelectedMarks();
            if (selectRectList.length) {
                let str = '';
                $.each(selectRectList, function (index, item) {
                    str += `ID: ${item.id} - X: ${item.x} - Y: ${item.y} - `;
                    str += `W: ${item.width} - H: ${item.height} \n`;
                });
                console.log(str);
                window.alert(str);
            } else {
                window.alert('没有选中的目标');
            }
        },
        setRectScaleUp(e: HTMLElementEventMap['click']): void {
            if (Zoom.index >= Zoom.level.length - 1) {
                window.alert('已放大至最大级别');
            } else {
                Zoom.index++;
                paperMarker.setZoom(Zoom.level[Zoom.index]);
            }
            console.log(e);
        },
        setRectScaleDown(e: HTMLElementEventMap['click']): void {
            if (Zoom.index <= 0) {
                window.alert('已缩小至最小级别');
            } else {
                Zoom.index--;
                paperMarker.setZoom(Zoom.level[Zoom.index]);
            }
            console.log(e);
        },
        clearRectSelectKey(e: HTMLElementEventMap['keyup']): void {
            if (e.code === '8' || e.code === '46') {
                paperMarker.clearCurrentMark();
            }
        }
    };

    paperMarker.run((): void => {
        let listener: EventListener;
        for (let key in events) {
            if (events.hasOwnProperty(key)) {
                listener = events[key];
                key === 'clearRectSelectKey' ? document.addEventListener('keyup', listener) :
                    document.getElementById(key).addEventListener('click', listener);
            }
        }
        initKeyboardShortcut();
        initAnswerListEvent(paperMarker);
        initKeyboardMove(function (offset) {
            paperMarker.moveSelectedMark(offset);
            paperMarker.renderList();
        });

        $('#multipleSelectStaus').on('change', function () {
            let value = $(this).val() !== '0';
            console.log(value);
            paperMarker.setMultipleSelectEnabled(value);
        });
        // $('.answer-list').find('input[data-group-id]').first().trigger('focusin');
    });
});
