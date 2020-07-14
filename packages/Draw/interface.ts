export type IType = 'draw' | 'show'

export type IActionType = 'start' | 'move' | 'end' | 'clear' | 'undo' | 'redo' | 'setStyle';

export type IOnSync = (action: IAction) => void

interface ICtxStyle {
  lineWidth?: number,
  lineColor?: string,
  shadowBlur?: number,
  lineCap?: CanvasLineCap,
  lineJoin?: CanvasLineJoin,
}

export interface IConfig extends ICtxStyle {
  container: HTMLElement,
  // 可以 draw 画 或者 show 纯展示
  type: IType,
  onSync?: IOnSync
}

export interface IPoint {
  x: number,
  y: number
}

export interface IAction {
  type: IActionType,
  point?: IPoint,
  styleAttr?: 'lineColor' | 'lineCap' | 'lineJoin' | 'lineWidth',
  styleValue?: string | number,
}
