import Scene from "./Scene";
import Sprite from "./Sprite";
import {IDanmu, IGlobalConfig} from "./interface";
import {mixConfig} from "./utils";
import {defaultGlobalConfig} from "./constant";

class Barrage {
  private readonly scene: Scene;
  public stop: () => void;
  public start: () => void;
  public clear: () => void;
  private readonly globalConfig: IGlobalConfig;

  public constructor(container: HTMLElement, globalConfig: IGlobalConfig = {}) {
    this.globalConfig = mixConfig(globalConfig, defaultGlobalConfig) as IGlobalConfig;
    // 创建场景
    this.scene = new Scene(container, this.globalConfig);

    this.stop = this.scene.stop.bind(this.scene);
    this.start = this.scene.start.bind(this.scene);
    this.clear = this.scene.clear.bind(this.scene);
  }

  public add({content, avatar}: IDanmu) {
    this.scene.add(
      new Sprite({
        avatar, content
      }, {
        ctx: this.scene.ctx,
      })
    );
  }
}

export default Barrage;
