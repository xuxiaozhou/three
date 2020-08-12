'use strict';

const createCanvas = (id, containerWidth, containerHeight) => {
    const element = window.document.createElement('canvas');
    element.id = id;
    element.width = containerWidth;
    element.height = containerHeight;
    return element;
};

class CashManager {
    constructor(canvas, ctx, repaint) {
        // private currentIndex: number;
        this.cashList = [];
        this.canvas = canvas;
        this.ctx = ctx;
        this.repaint = repaint;
    }
    clear() {
        this.cashList = [];
    }
    undo() {
        if (!this.cashList || this.cashList.length === 0) {
            return;
        }
        // const cash = this.cashList[this.cashList.length - 1];
        // console.log(this.repaint, cash);
    }
    redo() {
        console.log(this.repaint, this.ctx);
    }
    addRecord() {
        this.cashList.push(this.canvas.toDataURL());
        // this.currentIndex = this.cashList.length - 1;
    }
}

const getPoint = (e) => {
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
};

/**
 * todo list
 * - [ ] 回退，前进
 * - [ ] 同步多大尺寸
 * - [ ] 选择线粗细，颜色
 * - [ ] 保存图片
 * - [ ] 笔画更细腻
 * - [ ] 旋转
 */
class Draw {
    constructor(config) {
        this.type = 'draw';
        this.repaint = (image) => {
            this.clear();
            this.ctx.drawImage(image, 0, 0, this.containerWidth, this.containerHeight);
        };
        const { container, type = 'draw', lineWidth = 10, onSync, lineColor = '#fff', shadowBlur = 1, lineCap = 'round', lineJoin = 'round', } = config;
        this.containerWidth = container.offsetWidth;
        this.containerHeight = container.offsetHeight;
        this.type = type;
        this.lineWidth = lineWidth;
        this.onSync = onSync;
        this.canvas = this.initCanvas(container);
        this.ctx = this.canvas.getContext('2d');
        this.cashManager = new CashManager(this.canvas, this.ctx, this.repaint);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.shadowBlur = shadowBlur;
        this.ctx.shadowColor = lineColor;
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineCap = lineCap;
        this.ctx.lineJoin = lineJoin;
    }
    prepareDraw(canvas) {
        const start = e => {
            this.handle({
                type: 'start',
                point: getPoint(e),
            });
        };
        const end = this.handle.bind(this, { type: 'end' });
        const move = e => {
            this.handle({
                type: 'move',
                point: getPoint(e),
            });
        };
        // start
        canvas.addEventListener('touchstart', start);
        // move
        canvas.addEventListener('mousedown', e => {
            start(e);
            canvas.addEventListener('mousemove', move);
        });
        canvas.addEventListener('touchmove', move);
        // end
        canvas.addEventListener('touchend', end);
        const pcEnd = () => {
            canvas.removeEventListener('mousemove', move);
            end();
        };
        canvas.addEventListener('mouseup', pcEnd);
        // out
        canvas.addEventListener('mouseout', pcEnd);
    }
    initCanvas(container) {
        const canvas = createCanvas('draw', this.containerWidth, this.containerHeight);
        if (this.type === 'draw') {
            this.prepareDraw(canvas);
        }
        container.appendChild(canvas);
        return canvas;
    }
    action(action) {
        const { type } = action;
        if (type === 'setStyle') {
            const { styleAttr, styleValue } = action;
            if (styleAttr === 'lineColor') {
                this.ctx.shadowColor = styleValue.toString();
                this.ctx.strokeStyle = styleValue.toString();
                return;
            }
            if (styleAttr === 'lineWidth') {
                this.ctx[styleAttr] = styleValue;
                this.lineWidth = styleValue;
                return;
            }
            this.ctx[styleAttr] = styleValue;
            return;
        }
        if (type === 'start') {
            const { point } = action;
            this.ctx.beginPath();
            this.ctx.fill();
            this.ctx.moveTo(point.x - this.lineWidth / 16, point.y - this.lineWidth / 16);
            this.ctx.lineTo(point.x, point.y);
            this.ctx.stroke();
            return;
        }
        if (type === 'move') {
            const { point } = action;
            this.ctx.lineTo(point.x, point.y);
            this.ctx.stroke();
            return;
        }
        if (type === 'end') {
            this.ctx.closePath();
            return;
        }
        if (type === 'clear') {
            this.clear();
            return;
        }
        // 撤消（回到上一步）
        if (type === 'undo') {
            this.cashManager.undo();
        }
        // 重做（往前一步）
        if (type === 'redo') {
            this.cashManager.redo();
        }
    }
    clear() {
        this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
    }
    handle(action) {
        if (this.onSync) {
            this.onSync(action);
        }
        this.cashManager.addRecord();
        this.action(action);
    }
    getImage() {
        return this.canvas.toDataURL('image/png');
    }
}

module.exports = Draw;
