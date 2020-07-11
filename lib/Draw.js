'use strict';

const createCanvas = (id, containerWidth, containerHeight) => {
    const element = window.document.createElement('canvas');
    element.id = id;
    element.width = containerWidth;
    element.height = containerHeight;
    return element;
};

/**
 * todo list
 * - [ ] 回退，前进
 * - [ ] 同步多大尺寸
 * - [ ] 选择线粗细，颜色
 * - [ ] 保存图片
 * - [ ] 笔画更细腻
 */
class Draw {
    constructor(config) {
        this.type = 'draw';
        const { container, type, lineWidth, onSync } = config;
        this.containerWidth = container.offsetWidth;
        this.containerHeight = container.offsetHeight;
        this.type = type || 'draw';
        this.lineWidth = lineWidth || 5;
        this.onSync = onSync;
        this.initCanvas(container);
    }
    initCanvas(container) {
        const canvas = createCanvas('draw', this.containerWidth, this.containerHeight);
        if (this.type === 'draw') {
            const start = this.action.bind(this, 'start');
            const move = this.action.bind(this, 'move');
            const end = this.action.bind(this, 'end');
            canvas.addEventListener('touchstart', start);
            canvas.addEventListener('mousedown', e => {
                start(e);
                canvas.addEventListener('mousemove', move);
            });
            canvas.addEventListener('touchmove', move);
            canvas.addEventListener('touchend', end);
            canvas.addEventListener('mouseup', e => {
                end(e);
                canvas.removeEventListener('mousemove', move);
            });
        }
        this.ctx = canvas.getContext('2d');
        this.ctx.strokeStyle = '#fff';
        container.appendChild(canvas);
    }
    static getPoint(e) {
        if (e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            const x = touch.clientX;
            const y = touch.clientY;
            return { x, y };
        }
        return {
            x: e.clientX,
            y: e.clientY,
        };
    }
    draw(action) {
        const { type, point } = action;
        if (type === 'start') {
            this.ctx.beginPath();
            this.ctx.fill();
            this.ctx.moveTo(point.x - this.lineWidth / 16, point.y - this.lineWidth / 16);
            this.ctx.lineTo(point.x, point.y);
            this.ctx.stroke();
            return;
        }
        if (type === 'move') {
            this.ctx.lineTo(point.x, point.y);
            this.ctx.stroke();
            return;
        }
        if (type === 'end') {
            this.ctx.closePath();
            return;
        }
        if (type === 'clear') {
            this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
            return;
        }
    }
    action(type, e) {
        const action = { type };
        if (e) {
            action.point = Draw.getPoint(e);
        }
        if (this.onSync) {
            this.onSync(action);
        }
        this.draw(action);
    }
}

module.exports = Draw;
