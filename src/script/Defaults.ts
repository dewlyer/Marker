export const Defaults = {
    container: document.documentElement,
    canvasWidth: 0,
    creatable: false,
    draggable: true,
    scalable: false,
    data: null,
    style: {
        opacity: 0.3,
        line: {
            join: {
                normal: 'round',
                active: 'round',
                select: 'round',
                check: 'round'
            },
            dash: {
                normal: [5, 3],
                active: [5, 3],
                select: [5, 3],
                check: [5, 3]
            },
            width: {
                normal: 1,
                active: 1,
                select: 1,
                check: 1
            },
            color: {
                normal: 'rgb(0, 0, 255)',
                active: 'rgb(255, 48, 0)',
                select: 'rgb(255, 255, 255)',
                check: 'rgb(0, 255, 0)'
            }
        },
        rect: {
            color: {
                normal: 'rgb(0, 0, 255)',
                active: 'rgba(255, 48, 0)',
                select: 'rgb(255, 255, 255)',
                check: 'rgb(0, 255, 0)'
            }
        },
        text: {
            font: '14px Arial',
            bg: 'rgba(255, 255, 255)',
            color: {
                normal: 'rgba(255, 255, 255)',
                select: 'rgba(255, 255, 255)'
            }
        }
    },
    afterCheck: (groupId, groupIndexArr) => {
    },
    startDrag: (x, y) => {
    },
    endDrag: () => {
    }
};
