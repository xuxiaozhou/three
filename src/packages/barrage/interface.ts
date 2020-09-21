export type IPosition = [number, number]

export interface ISpriteConfig {
  content?: string,
  avatar?: string | CanvasImageSource,
  position?: IPosition,
  imageSize?: number,
  type?: 'text' | 'image',
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string,
  padding?: [number, number, number, number],
  radius?: number,
  avatarSize?: number,
  image?: string | CanvasImageSource
}

export type IType = 'scroll' | 'reversescroll'

export interface ICalcGlobalConfig {
  containerHeight?: number,
  containerWidth?: number,
  trackRange?: [number, number],
}

export interface IGlobalConfig extends ICalcGlobalConfig {
  type?: IType,
  lifeTime?: number,
  ctx?: CanvasRenderingContext2D,
  templateCtx?: CanvasRenderingContext2D,
  templateCanvas?: HTMLCanvasElement,
  templateSpriteCanvas?: HTMLCanvasElement;
  canvas?: HTMLCanvasElement,
  container?: HTMLElement
}

type AvatarImage = string | CanvasImageSource;

export interface ISize {
  width: number,
  height: number
}

export interface IDrawOptions extends ISize {
  avatar?: AvatarImage,
  image?: AvatarImage,
}
