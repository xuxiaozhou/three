export interface IDanmu {
    content: string;
    avatar: string;
}
export interface IFont {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: string;
}
export declare type IPosition = [number, number];
export declare type ISpriteType = 'text' | 'image';
export interface IStyle {
    padding?: [number, number, number, number];
    radius?: number;
    avatarSize?: number;
}
export interface ISprite extends IFont, IStyle {
    avatar?: string;
    content?: string;
    position?: IPosition;
    imageSize?: number;
    type?: ISpriteType;
}
export interface IRoundImageArgs {
    img: CanvasImageSource;
    position: IPosition;
    radius?: number;
    imageWidth: number;
    imageHeight: number;
}
export declare type IType = 'scroll' | 'reversescroll';
export interface IGlobalConfig {
    type?: IType;
    lifeTime?: number;
    ctx?: CanvasRenderingContext2D;
}
export interface IAnimationData {
    position: IPosition;
    speed: IPosition;
    rangeWidth: IPosition | undefined;
}
export interface IPos {
    left?: number;
    top?: number;
}
