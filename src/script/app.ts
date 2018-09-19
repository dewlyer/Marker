// import bg from '../images/bg.jpg';
import '../style/app.scss';
import * as $ from 'jquery';
import {Marker as PaperMarker} from './Marker';

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

function setCanvasPosition(position) {
    let $container = $('#container');
    let $target = $('#canvas');
    $target.css({
        left: $container.width() / 2 - position.x,
        top: $container.height() / 2 - position.y
    });
}

function updateDraggingPosition(coords, x, y) {
    let $target = $('#canvas');
    let left = parseInt($target.css('left'), 10);
    let top = parseInt($target.css('top'), 10);
    $target.css({
        left: left + x - coords.x,
        top: top + y - coords.y
    });
    coords.x = x;
    coords.y = y;
    return coords;
}

function initAnswerListEvent(paperMarker) {
    $('.answer-list')
        .on('focus', 'input', function () {
            let $this = $(this);
            let input = <HTMLInputElement> $this.get(0);
            let groupId = $this.data('group-id');
            input.select();
            paperMarker.clearMarkSelected();
            paperMarker.setGroupSelectedByCheck(groupId);
            let pos = paperMarker.getGroupCenterPosition(groupId);
            setCanvasPosition(pos);
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
                paperMarker.clearMarkSelected();
                paperMarker.setGroupChecked(groupId, indexArr);
                paperMarker.setGroupSelectedByCheck(groupId);
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
        clearRectList(e: HTMLElementEventMap['click']): void {
            console.log(e);
            paperMarker.clear();
        },
        clearRectSelect(e: HTMLElementEventMap['click']): void {
            console.log(e);
            paperMarker.clearCurrentMark();
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
            let selectRect = paperMarker.getSelectedMark();
            if (selectRect) {
                let str = `ID: ${selectRect.id} - X: ${selectRect.x} - Y: ${selectRect.y} - `;
                str += `W: ${selectRect.width} - H: ${selectRect.height}`;
                console.log(selectRect);
                window.alert(str);
            } else {
                window.alert('没有选中的目标');
            }
        },
        setRectScaleUp(e: HTMLElementEventMap['click']): void {
            console.log(e);
            paperMarker.setZoom(2);
        },
        setRectScaleDown(e: HTMLElementEventMap['click']): void {
            console.log(e);
            paperMarker.setZoom(0.5);
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
        initAnswerListEvent(paperMarker);
        // $('.answer-list').find('input[data-group-id]').first().trigger('focusin');
    });
});
