// import '../style/index.scss';
// import bg from '../images/bg.jpg';
// import PaperMarker from './paperMarker';
//
// window.onload = () => {
//
//     let [canvas, imageUrl, paperMarker, events] = [document.getElementById('canvas'), bg, null, {}];
//
//     if(!PaperMarker) return;
//
//     paperMarker = new PaperMarker(canvas, imageUrl);
//
//     events = {
//         clearRectList () {
//             paperMarker.clear();
//         },
//         clearRectSelect () {
//             paperMarker.clearCurrentMark();
//         },
//         getRectListInfo () {
//             let rectList = paperMarker.getMarkList();
//             if(rectList.length > 0) {
//                 console.log(rectList);
//                 alert(JSON.stringify(rectList));
//             }
//             else {
//                 alert('没有可输出的信息');
//             }
//         },
//         getRectSelectInfo () {
//             let selectRect = paperMarker.getSelectedMark();
//             if(selectRect) {
//                 let str = `ID: ${selectRect.id} - X: ${selectRect.x} - Y: ${selectRect.y} - W: ${selectRect.width} - H: ${selectRect.height}`;
//                 // let str = 'ID : ' + selectRect.id + '\n';
//                 // str += 'X : ' + selectRect.x + '\n';
//                 // str += 'Y : ' + selectRect.y + '\n';
//                 // str += 'Width : ' + selectRect.width + '\n';
//                 // str += 'Height :' + selectRect.height;
//                 alert(str);
//                 console.log(selectRect);
//             }
//             else {
//                 alert('没有选中的目标');
//             }
//         },
//         setRectScaleUp () {
//             paperMarker.setCanvasScale(2);
//         },
//         setRectScaleDown () {
//             paperMarker.setCanvasScale(0.5);
//         },
//         clearRectSelectKey (ev) {
//             if(ev.keyCode === 8 || ev.keyCode === 46) {
//                 paperMarker.clearCurRect();
//             }
//         },
//     };
//
//     paperMarker.initialize( () => {
//         for(let key in events) {
//             if(events.hasOwnProperty(key)) {
//                 key === 'clearRectSelectKey' ? $(document).on('keyup', events[key]) : $('#' + key).on('click', events[key]);
//             }
//         }
//     });
//
//
// };