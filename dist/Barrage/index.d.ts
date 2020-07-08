import { IDanmu, IGlobalConfig } from "./interface";
declare class Barrage {
    private readonly scene;
    stop: () => void;
    start: () => void;
    clear: () => void;
    private readonly globalConfig;
    constructor(container: HTMLElement, globalConfig?: IGlobalConfig);
    add({ content, avatar }: IDanmu): void;
}
export default Barrage;
