import { IDrawOptions, IGlobalConfig, ISpriteConfig } from "../interface";
export interface IRoundImageArgs {
    img: CanvasImageSource;
    position: [number, number];
    radius?: number;
    imageWidth: number;
    imageHeight: number;
}
declare class DrawManager {
    private globalConfig;
    private spriteConfig;
    constructor(spriteConfig: ISpriteConfig, globalConfig: IGlobalConfig);
    calcSize(): [number, number];
    draw(ctx: CanvasRenderingContext2D, options: IDrawOptions): void;
    private static drawBorder;
    private static drawAvatar;
    private drawText;
}
export default DrawManager;
