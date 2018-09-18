// import bg from '../images/bg.jpg';
import '../style/app.scss';
import { Marker as PaperMarker } from './Marker';

const AnswerList = 'ABCD';

window.addEventListener('load', (event: WindowEventMap['load']): any => {
    let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
    let imageUrl = canvas.dataset.img;
    let paperMarker: PaperMarker;
    let events: object;
    let option = {
        data: [
            // 第一题
            {x: 201, y: 595, width: 27, height: 16, groupId: '001', checked: true},
            {x: 233, y: 595, width: 27, height: 16, groupId: '001'},
            {x: 265, y: 595, width: 27, height: 16, groupId: '001'},
            {x: 297, y: 595, width: 27, height: 16, groupId: '001'},
            // 第二题
            {x: 201, y: 616, width: 27, height: 16, groupId: '002'},
            {x: 233, y: 616, width: 27, height: 16, groupId: '002', checked: true},
            {x: 265, y: 616, width: 27, height: 16, groupId: '002'},
            {x: 297, y: 616, width: 27, height: 16, groupId: '002'},
            // 第三题
            {x: 201, y: 637, width: 27, height: 16, groupId: '003'},
            {x: 233, y: 637, width: 27, height: 16, groupId: '003'},
            {x: 265, y: 637, width: 27, height: 16, groupId: '003', checked: true},
            {x: 297, y: 637, width: 27, height: 16, groupId: '003'},
            // 第四题
            {x: 361, y: 595, width: 27, height: 16, groupId: '004'},
            {x: 393, y: 595, width: 27, height: 16, groupId: '004'},
            {x: 425, y: 595, width: 27, height: 16, groupId: '004'},
            {x: 457, y: 595, width: 27, height: 16, groupId: '004', checked: true},
            // 第五题
            {x: 361, y: 616, width: 27, height: 16, groupId: '005'},
            {x: 393, y: 616, width: 27, height: 16, groupId: '005'},
            {x: 425, y: 616, width: 27, height: 16, groupId: '005', checked: true},
            {x: 457, y: 616, width: 27, height: 16, groupId: '005'},
            // 第六题
            {x: 361, y: 637, width: 27, height: 16, groupId: '006'},
            {x: 393, y: 637, width: 27, height: 16, groupId: '006', checked: true},
            {x: 425, y: 637, width: 27, height: 16, groupId: '006'},
            {x: 457, y: 637, width: 27, height: 16, groupId: '006'}
        ],
        afterCheck: function (groupId, index) {
            let answer = AnswerList[index];
            $('.answer-list')
                .find('input').filter(function () {
                    return $(this).data('group-id') === groupId;
                })
                .addClass('active')
                .val(answer)
                .parent().siblings().children('input').removeClass('active');
        }
    };

    paperMarker = new PaperMarker(canvas, imageUrl, option);

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

        $('.answer-list').on('input', 'input', function () {
            let $this = $(this);
            let groupId = $this.data('group-id');
            let str = $this.val().toString().toUpperCase();
            let index = AnswerList.indexOf(str);
            if (index !== -1) {
                paperMarker.clearMarkSelected();
                paperMarker.setGroupChecked(groupId, index);
                paperMarker.setGroupSelectedByCheck(groupId);
            } else {
                window.alert('答案输入不正确，请重新输入！');
            }
            $this.val($this.val().toString().toUpperCase());
        }).on('focus', 'input', function () {
            let $this = $(this);
            let input = <HTMLInputElement> $this.get(0);
            let groupId = $this.data('group-id');
            paperMarker.clearMarkSelected();
            paperMarker.setGroupSelectedByCheck(groupId);
            input.select();

            $this.addClass('active')
                .parent().siblings().children('input').removeClass('active');
        });
    });

    console.log(event);
});
