import { IGlobalConfig } from "../interface";
import Sprite from "../Sprite";
declare class TrackManager {
    private globalConfig;
    constructor(globalConfig: IGlobalConfig);
    private employTrack;
    private getCanUseTrack;
    applyPosition(sprite: Sprite): null | number;
    removeEmployWithNotEmploy(sprite: Sprite): void;
}
export default TrackManager;
