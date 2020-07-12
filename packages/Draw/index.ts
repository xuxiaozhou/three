import {createCanvas} from "../utils/utils";
import CashManager from "./CashManager";

type IType = 'draw' | 'show'

type IActionType = 'start' | 'move' | 'end' | 'clear' | 'undo' | 'redo' | 'setStyle';

type IOnSync = (action: IAction) => void

interface ICtxStyle {
  lineWidth?: number,
  lineColor?: string,
  shadowBlur?: number,
  lineCap?: CanvasLineCap,
  lineJoin?: CanvasLineJoin,
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
  type: IActionType,
  point?: IPoint,
  styleAttr?: 'lineColor' | 'lineCap' | 'lineJoin' | 'lineWidth',
  styleValue?: string | number,
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
  private lineWidth: number;
  private readonly onSync: IOnSync | undefined;
  private readonly canvas: HTMLCanvasElement;
  private cashManager: CashManager;

  public constructor(config: IConfig) {
    const {
      container,
      type = 'draw',
      lineWidth = 10,
      onSync,
      lineColor = '#fff',
      shadowBlur = 1,
      lineCap = 'round',
      lineJoin = 'round',
    } = config;

    this.containerWidth = container.offsetWidth;
    this.containerHeight = container.offsetHeight;
    this.type = type;
    this.lineWidth = lineWidth;
    this.onSync = onSync;

    this.canvas = this.initCanvas(container);
    this.ctx = this.canvas.getContext('2d');
    this.cashManager = new CashManager(this.canvas);

    this.ctx.lineWidth = this.lineWidth;
    this.ctx.shadowBlur = shadowBlur;
    this.ctx.shadowColor = lineColor;
    this.ctx.strokeStyle = lineColor;
    this.ctx.lineCap = lineCap;
    this.ctx.lineJoin = lineJoin;
  }

  private initCanvas(container): HTMLCanvasElement {
    const canvas = createCanvas('draw', this.containerWidth, this.containerHeight);

    if (this.type === 'draw') {
      const start = (e) => {
        this.handle({
          type: 'start',
          point: Draw.getPoint(e)
        });
      };
      const end = this.handle.bind(this, {type: 'end'});
      const move = (e) => {
        this.handle({
          type: 'move',
          point: Draw.getPoint(e)
        });
      };

      canvas.addEventListener('touchstart', start);
      canvas.addEventListener('mousedown', e => {
        start(e);
        canvas.addEventListener('mousemove', move);
      });
      canvas.addEventListener('touchmove', move);
      canvas.addEventListener('touchend', end);
      canvas.addEventListener('mouseup', () => {
        end();
        canvas.removeEventListener('mousemove', move);
      });
    }

    container.appendChild(canvas);
    return canvas;
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

  public action(action: IAction) {
    const {type} = action;

    if (type === 'setStyle') {
      const {styleAttr, styleValue} = action;

      if (styleAttr === 'lineColor') {
        this.ctx.shadowColor = styleValue.toString();
        this.ctx.strokeStyle = styleValue.toString();
        return;
      }

      if (styleAttr === 'lineWidth') {
        this.ctx[styleAttr] = styleValue as never;
        this.lineWidth = styleValue as number;
        return;
      }

      this.ctx[styleAttr] = styleValue as never;

      return;
    }

    if (type === 'start') {
      const {point} = action;
      this.ctx.beginPath();
      this.ctx.fill();
      this.ctx.moveTo(point.x - this.lineWidth / 16, point.y - this.lineWidth / 16);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
      return;
    }

    if (type === 'move') {
      const {point} = action;
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
      this.cashManager.undo(this.repaint);
    }

    // 重做（往前一步）
    if (type === 'redo') {
      this.cashManager.redo(this.repaint);
    }
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
  }

  private repaint = (image: CanvasImageSource) => {
    this.clear();
    this.ctx.drawImage(image, 0, 0, this.containerWidth, this.containerHeight);
  };

  private handle(action: IAction) {
    if (this.onSync) {
      this.onSync(action);
    }

    this.action(action);
    this.cashManager.record();
  }

  public getImage() {
    return this.canvas.toDataURL('image/png');
  }
}

export default Draw;
