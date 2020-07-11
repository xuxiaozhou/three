import {createCanvas} from "../utils/utils";

type IType = 'draw' | 'show'

type IDrawType = 'start' | 'move' | 'end' | 'clear' | 'undo' | 'redo';

type IOnSync = (action: IAction) => void

interface ICtxStyle {
  lineWidth?: number,
  lineColor?: string,
}

interface IConfig extends ICtxStyle {
  container: HTMLElement,
  // 可以 draw 画 或者 show 纯展示
  type: IType,
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
 * - [ ] 旋转
 */
class Draw {
  private readonly containerWidth: number;
  private readonly containerHeight: number;
  private readonly type: IType = 'draw';
  public ctx: CanvasRenderingContext2D;
  private readonly lineWidth: number;
  private readonly onSync: IOnSync | undefined;
  private readonly lineColor: string;
  private canvas: HTMLCanvasElement;
  private cashList: string[] = [];
  private index: number = -1;

  public constructor(config: IConfig) {
    const {container, type, lineWidth, onSync, lineColor} = config;
    this.containerWidth = container.offsetWidth;
    this.containerHeight = container.offsetHeight;
    this.type = type || 'draw';

    this.lineColor = lineColor || '#fff';
    this.lineWidth = lineWidth || 10;

    this.onSync = onSync;
    this.initCanvas(container);
  }

  private initCanvas(container) {
    const canvas = createCanvas('draw', this.containerWidth, this.containerHeight);

    if (this.type === 'draw') {
      const start = this.action.bind(this, 'start');
      const end = this.action.bind(this, 'end');
      const move = (e) => {
        this.action('move', e)
      };

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

    container.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

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

  public setCtx(ctxStyle: ICtxStyle = {}) {
    Object.keys(ctxStyle).forEach(attr => {
      this.ctx[attr] = ctxStyle[attr];

      if (attr === 'lineColor') {
        this.ctx.strokeStyle = ctxStyle.lineColor;
      }
    })
  }

  private prepareCtx() {
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.shadowBlur = 1;
    this.ctx.shadowColor = this.lineColor;
    this.ctx.strokeStyle = this.lineColor;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  private record() {
    this.cashList.push(this.canvas.toDataURL());
  }

  public draw(action: IAction) {
    const {type, point} = action;
    this.prepareCtx();

    if (type === 'start') {
      this.ctx.beginPath();
      this.ctx.fill();
      this.ctx.moveTo(point.x - this.lineWidth / 16, point.y - this.lineWidth / 16);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
      this.record();
      return;
    }

    if (type === 'move') {
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
      this.record();
      return;
    }

    if (type === 'end') {
      this.ctx.closePath();
      this.record();
      return;
    }

    if (type === 'clear') {
      this.index = -1;
      this.clear();
      return;
    }

    // 撤消（回到上一步）
    if (type === 'undo') {
      if (this.index === -1) {
        this.index = this.cashList.length;
      }

      if (this.index === 0) {
        return;
      }

      this.index -= 1;
      this.repaintByCashList();
    }

    if (type === 'redo') {
      // 重做（往前一步）
      if (this.index === this.cashList.length - 1) {
        return;
      }
      this.index += 1;
      this.repaintByCashList();
    }
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
  }

  private repaintByCashList() {
    const image = new Image();
    image.src = this.cashList[this.index];
    image.onload = () => {
      this.clear();
      this.ctx.drawImage(image, 0, 0, image.width, image.height);
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

  public getImage() {
    return this.canvas.toDataURL('image/png');
  }
}

export default Draw;
