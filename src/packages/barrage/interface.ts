export type IAnimateType = 'scroll' | 'reversescroll'

export interface IPropGlobalConfig {
  type?: IAnimateType,
  lifeTime?: number,
  container?: HTMLElement,
}

export interface IGlobalConfig extends IPropGlobalConfig {
  ctx?: CanvasRenderingContext2D,
  templateCtx?: CanvasRenderingContext2D,
  templateBarrageCanvas?: HTMLCanvasElement;
  canvas?: HTMLCanvasElement,
  templateCanvas?: HTMLCanvasElement,
}

export interface IBarrageConfig {
  content?: string,
  avatar?: string | CanvasImageSource,
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string,
  padding?: [number, number, number, number],
  radius?: number,
  avatarSize?: number
}
