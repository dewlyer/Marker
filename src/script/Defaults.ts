export let Defaults = {
    container: document.documentElement,
    canvasWidth: 0,
    style: {
        line: {
            join: {
                normal: 'round',
                active: 'round',
                check: 'round',
                select: 'round'
            },
            dash: {
                normal: [5, 3],
                active: [5, 3],
                check: [5, 3],
                select: [5, 3]
            },
            width: {
                normal: 1,
                active: 1,
                check: 1,
                select: 1
            },
            color: {
                normal: 'rgb(20, 71, 204)',
                active: 'rgb(255, 48, 0)',
                check: 'rgb(60, 60, 60)',
                select: 'rgb(60, 60, 60)'
            }
        },
        rect: {
            color: {
                normal: 'rgba(20, 71, 204, 0.25)',
                active: 'rgba(255, 48, 0, 0.25)',
                check: 'rgb(60, 60, 60)',
                select: 'rgba(255, 48, 0, 0.25)'
            }
        },
        text: {
            font: '14px Arial',
            bg: 'rgba(255, 255, 255, 0.75)',
            color: {
                normal: 'rgba(255, 255, 255, 0.75)',
                select: 'rgba(255, 255, 255, 0.75)'
            }
        }
    },
    data: null,
    creatable: false,
    draggable: true,
    scalable: false
};
