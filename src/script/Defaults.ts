let Defaults = {
    container: document.documentElement,
    canvasWidth: 0,
    line: {
        color: {
            normal: 'rgb(20, 71, 204)',
            select: 'rgb(255, 48, 0)',
            active: 'rgb(60, 60, 60)'
        },
        width: 1,
        join: 'round',
        dash: [5, 3]
    },
    rect: {
        color: {
            normal: 'rgba(20, 71, 204, 0.25)',
            select: 'rgba(255, 48, 0, 0.25)'
        }
    },
    text: {
        font: '14px Arial',
        color: 'rgba(255, 255, 255, 0.75)'
    }
};

export { Defaults };
