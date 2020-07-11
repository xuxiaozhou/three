import { IGlobalConfig, ISpriteConfig } from "./interface";
declare class Barrage {
    private readonly scene;
    stop: () => void;
    start: () => void;
    clear: () => void;
    private readonly globalConfig;
    private readonly container;
    constructor(container: HTMLElement, globalConfig?: IGlobalConfig);
    add(spriteConfig: ISpriteConfig): void;
    destroy(): void;
    private resize;
    private initCanvas;
    private calcData;
}
export default Barrage;
