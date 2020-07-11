import Sprite from "./Sprite";
import { IGlobalConfig } from "./interface";
declare class Scene {
    private globalConfig;
    private trackManger;
    private timer;
    private spriteInstances;
    private needAddSpriteList;
    constructor(globalConfig: IGlobalConfig);
    private calcAnimation;
    add(sprite: Sprite): void;
    private addSprite;
    private tryToAddSprite;
    resetGlobalConfig(globalConfig: IGlobalConfig): void;
    start(): void;
    stop(): void;
    clear(): void;
    destroy(): void;
    private run;
    private drawTemplateCanvas;
    private render;
}
export default Scene;
