import { IAnimationData, IGlobalConfig, ISpriteConfig } from "./interface";
declare class Sprite {
    id: string;
    status: boolean;
    private position;
    private speed;
    size: [number, number];
    private rangeWidth?;
    private templateCtx;
    private avatarImage?;
    private readonly templateCanvas;
    private readonly drawManager;
    employTrack: boolean;
    private spriteConfig;
    private globalConfig;
    constructor(spriteConfig: ISpriteConfig, globalConfig: IGlobalConfig);
    private getImageData;
    render(ctx: any): void;
    setAnimation({ position, speed, rangeWidth }: IAnimationData): void;
    private checkEmployTrack;
    animation(): void;
    remove(): void;
}
export default Sprite;
