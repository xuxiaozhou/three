import { IAnimationData, ISprite, IGlobalConfig } from "./interface";
declare class Sprite {
    status: boolean;
    private speed;
    private avatar;
    private readonly content;
    position: [number, number];
    rect: [number, number];
    private rangeWidth?;
    private templateCtx;
    private style;
    private font;
    private readonly templateCanvas;
    employTrack: boolean;
    id: string;
    private set avatarStatus(value);
    constructor(spriteArgs: ISprite, globalConfig: IGlobalConfig);
    private getImageData;
    render(ctx: any): void;
    private loadingImage;
    private calcRect;
    setAnimation({ position, speed, rangeWidth }: IAnimationData): void;
    private draw;
    private static checkEmployTrack;
    animation({ type, containerWidth }: {
        type: any;
        containerWidth: any;
    }): void;
    remove(): void;
    private drawBorder;
    private drawText;
    private static drawAvatar;
}
export default Sprite;
