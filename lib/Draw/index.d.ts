declare type IType = 'draw' | 'show';
declare type IDrawType = 'start' | 'move' | 'end' | 'clear' | 'undo' | 'redo';
declare type IOnSync = (action: IAction) => void;
interface ICtxStyle {
    lineWidth?: number;
    lineColor?: string;
}
interface IConfig extends ICtxStyle {
    container: HTMLElement;
    type: IType;
    onSync?: IOnSync;
}
interface IPoint {
    x: number;
    y: number;
}
interface IAction {
    point?: IPoint;
    type: IDrawType;
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
declare class Draw {
    private readonly containerWidth;
    private readonly containerHeight;
    private readonly type;
    ctx: CanvasRenderingContext2D;
    private readonly lineWidth;
    private readonly onSync;
    private readonly lineColor;
    private canvas;
    private cashList;
    private index;
    constructor(config: IConfig);
    private initCanvas;
    private static getPoint;
    setCtx(ctxStyle?: ICtxStyle): void;
    private prepareCtx;
    private record;
    draw(action: IAction): void;
    private clear;
    private repaintByCashList;
    private action;
    getImage(): string;
}
export default Draw;
