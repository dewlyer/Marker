// import bg from '../images/bg.jpg';
import '../style/app.scss';
import { Marker as PaperMarker } from './Marker';

window.addEventListener('load', (event: WindowEventMap['load']): any => {
    let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
    let imageUrl = canvas.dataset.img;
    let paperMarker: PaperMarker;
    let events: object;
    let option = {
        data: [
            // 第一题
            {x: 201, y: 595, width: 27, height: 16, checked: true},
            {x: 233, y: 595, width: 27, height: 16},
            {x: 265, y: 595, width: 27, height: 16},
            {x: 297, y: 595, width: 27, height: 16},
            // 第二题
            {x: 201, y: 616, width: 27, height: 16},
            {x: 233, y: 616, width: 27, height: 16, checked: true},
            {x: 265, y: 616, width: 27, height: 16},
            {x: 297, y: 616, width: 27, height: 16},
            // 第三题
            {x: 201, y: 637, width: 27, height: 16},
            {x: 233, y: 637, width: 27, height: 16},
            {x: 265, y: 637, width: 27, height: 16, checked: true},
            {x: 297, y: 637, width: 27, height: 16},
            // 第四题
            {x: 361, y: 595, width: 27, height: 16},
            {x: 393, y: 595, width: 27, height: 16},
            {x: 425, y: 595, width: 27, height: 16},
            {x: 457, y: 595, width: 27, height: 16, checked: true},
            // 第五题
            {x: 361, y: 616, width: 27, height: 16},
            {x: 393, y: 616, width: 27, height: 16},
            {x: 425, y: 616, width: 27, height: 16, checked: true},
            {x: 457, y: 616, width: 27, height: 16},
            // 第六题
            {x: 361, y: 637, width: 27, height: 16},
            {x: 393, y: 637, width: 27, height: 16, checked: true},
            {x: 425, y: 637, width: 27, height: 16},
            {x: 457, y: 637, width: 27, height: 16}
        ]
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
    });

    console.log(event);
});
