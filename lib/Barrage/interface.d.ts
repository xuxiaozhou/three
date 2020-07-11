export declare type IPosition = [number, number];
export interface ISpriteConfig {
    content?: string;
    avatar?: string;
    position?: IPosition;
    imageSize?: number;
    type?: 'text' | 'image';
    fontFamily?: string;
    fontSize?: number;
    fontColor?: string;
    padding?: [number, number, number, number];
    radius?: number;
    avatarSize?: number;
}
export declare type IType = 'scroll' | 'reversescroll';
export interface ICalcGlobalConfig {
    containerHeight?: number;
    containerWidth?: number;
    trackRange?: [number, number];
}
export interface IGlobalConfig extends ICalcGlobalConfig {
    type?: IType;
    lifeTime?: number;
    ctx?: CanvasRenderingContext2D;
    templateCtx?: CanvasRenderingContext2D;
    templateCanvas?: HTMLCanvasElement;
    canvas?: HTMLCanvasElement;
}
export interface IAnimationData {
    position: IPosition;
    speed: IPosition;
    rangeWidth: IPosition | undefined;
}
export declare type AvatarImage = string | CanvasImageSource;
export interface IDrawOptions {
    avatarImage: AvatarImage;
    size: IPosition;
}
