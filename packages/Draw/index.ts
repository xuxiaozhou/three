import {createCanvas} from "../utils/utils";

type IType = 'draw' | 'show'

type IDrawType = 'start' | 'move' | 'end';

interface IConfig {
  container: HTMLElement,
  // 可以 draw 画 或者 show 纯展示
  type: IType,
  lineWidth: number,
}

interface IPoint {
  x: number,
  y: number
}

interface IAction {
  point: IPoint,
  type: IDrawType,
}

class Draw {
  private container: HTMLElement;
  private readonly containerWidth: number;
  private readonly containerHeight: number;
  private readonly type: IType = 'draw';
  public ctx: CanvasRenderingContext2D;
  private readonly lineWidth: number;

  public constructor(config: IConfig) {
    const {container, type, lineWidth} = config;
    this.container = container;
    this.containerWidth = container.offsetWidth;
    this.containerHeight = container.offsetHeight;
    this.type = type || 'draw';
    this.lineWidth = lineWidth || 5;
    this.initCanvas();
  }

  private initCanvas() {
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

    this.container.appendChild(canvas);
  }

  private static getPoint(e): IPoint {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      return {x, y};
    }

    return {
      x: e.clientX,
      y: e.clientY,
    }
  }

  private draw(action: IAction) {
    const {type, point} = action;
    if (type === 'start') {
      this.ctx.beginPath();
      this.ctx.fill();
      this.ctx.moveTo(point.x - this.lineWidth / 16, point.y - this.lineWidth / 16);
      this.ctx.lineTo(point.x, point.y);
    }

    if (type === 'move') {
      this.ctx.lineTo(point.x, point.y);
    }

    this.ctx.stroke();
  }

  private action(type, e) {
    const action: IAction = {
      type,
      point: Draw.getPoint(e),
    };
    // todo 同步
    this.draw(action);
  }
}

export default Draw;
