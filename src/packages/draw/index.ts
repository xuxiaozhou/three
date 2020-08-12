import {createCanvas} from "../utils/utils";
import CashManager from "./CashManager";
import {IType, IOnSync, IConfig, IAction} from "./interface";
import {getPoint} from "./utils";

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
    this.cashManager = new CashManager(this.canvas, this.ctx, this.repaint);

    this.ctx.lineWidth = this.lineWidth;
    this.ctx.shadowBlur = shadowBlur;
    this.ctx.shadowColor = lineColor;
    this.ctx.strokeStyle = lineColor;
    this.ctx.lineCap = lineCap;
    this.ctx.lineJoin = lineJoin;
  }

  private prepareDraw(canvas) {
    const start = e => {
      this.handle({
        type: 'start',
        point: getPoint(e),
      });
    };
    const end = this.handle.bind(this, {type: 'end'});
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

  private initCanvas(container): HTMLCanvasElement {
    const canvas = createCanvas('draw', this.containerWidth, this.containerHeight);

    if (this.type === 'draw') {
      this.prepareDraw(canvas);
    }

    container.appendChild(canvas);
    return canvas;
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
      this.cashManager.undo();
    }

    // 重做（往前一步）
    if (type === 'redo') {
      this.cashManager.redo();
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

    this.cashManager.addRecord();
    this.action(action);
  }

  public getImage() {
    return this.canvas.toDataURL('image/png');
  }
}

export default Draw;
