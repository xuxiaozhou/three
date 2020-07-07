import {createCanvas} from "../utils/utils";

type IType = 'draw' | 'show'

type IDrawType = 'start' | 'move' | 'end' | 'clear' | 'undo' | 'redo';

type IOnSync = (action: IAction) => void

interface IConfig {
  container: HTMLElement,
  // 可以 draw 画 或者 show 纯展示
  type: IType,
  lineWidth: number,
  onSync?: IOnSync
}

interface IPoint {
  x: number,
  y: number
}

interface IAction {
  point?: IPoint,
  type: IDrawType,
}

/**
 * todo list
 * - [ ] 回退，前进
 * - [ ] 同步多大尺寸
 * - [ ] 选择线粗细，颜色
 * - [ ] 保存图片
 * - [ ] 笔画更细腻
 */
class Draw {
  private readonly containerWidth: number;
  private readonly containerHeight: number;
  private readonly type: IType = 'draw';
  public ctx: CanvasRenderingContext2D;
  private readonly lineWidth: number;
  private readonly onSync: IOnSync | undefined;

  public constructor(config: IConfig) {
    const {container, type, lineWidth, onSync} = config;
    this.containerWidth = container.offsetWidth;
    this.containerHeight = container.offsetHeight;
    this.type = type || 'draw';
    this.lineWidth = lineWidth || 5;
    this.onSync = onSync;
    this.initCanvas(container);
  }

  private initCanvas(container) {
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

  public draw(action: IAction) {
    const {type, point} = action;

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

    if (type === 'undo') {
      // 撤消（回到上一步）
    }

    if (type === 'redo') {
      // 重做（往前一步）
    }
  }

  private action(type, e?) {
    const action: IAction = {type};

    if (e) {
      action.point = Draw.getPoint(e)
    }

    if (this.onSync) {
      this.onSync(action);
    }

    this.draw(action);
  }
}

export default Draw;
