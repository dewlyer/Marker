// import bg from '../images/bg.jpg';
import '../style/app.scss';
import { Marker as PaperMarker } from './Marker';

window.addEventListener('load', (event: WindowEventMap['load']): any => {
    let canvas = document.getElementById('canvas');
    let imageUrl = require('../images/bg.jpg');
    let paperMarker: PaperMarker;
    let events: object;

    paperMarker = new PaperMarker(canvas, imageUrl);

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
            paperMarker.setCanvasScale(2);
        },
        setRectScaleDown(e: HTMLElementEventMap['click']): void {
            console.log(e);
            paperMarker.setCanvasScale(0.5);
        },
        clearRectSelectKey(e: HTMLElementEventMap['keyup']): void {
            if (e.code === '8' || e.code === '46') {
                paperMarker.clearCurRect();
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
