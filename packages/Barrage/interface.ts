export interface IDanmu {
  content: string,
  avatar: string
}

export type IPosition = [number, number]

export interface ISprite {
  avatar?: string,
  content?: string,
  position?: IPosition,
  imageSize?: number,
  radius?: number,
  fontSize?: number,
  fontColor?: string,
  fontFamily?: string,
}

export interface IRoundImageArgs {
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  position: IPosition,
  radius?: number,
  imageWidth: number,
  imageHeight: number
}

export type IType = 'scroll' | 'reversescroll'

export interface IGlobalConfig {
  type?: IType
}
