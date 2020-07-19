import Sprite from "./Sprite";
import {IGlobalConfig} from "./interface";
import TrackManager from "./TrackManager";

class Scene {
  private globalConfig: IGlobalConfig;
  private trackManger: TrackManager;

  private timer = null;

  // 精灵实例map
  private spriteInstances: { [x: string]: Sprite } = {};

  // 需要加入的精灵
  private needAddSpriteList: Sprite[] = [];

  public constructor(globalConfig: IGlobalConfig) {
    this.globalConfig = globalConfig;
    this.trackManger = new TrackManager(globalConfig);
    this.start();
  }

  public add(sprite: Sprite) {
    this.needAddSpriteList.push(sprite);
  }

  private tryToAddSprite() {
    if (this.needAddSpriteList.length === 0) {
      return
    }

    const [sprite] = this.needAddSpriteList;
    const positionY = this.trackManger.applyPosition(sprite);

    if (positionY) {
      sprite.setAnimation(positionY);
      this.spriteInstances[sprite.id] = sprite;
      this.needAddSpriteList.shift();
    }
  }

  public resetGlobalConfig(globalConfig: IGlobalConfig) {
    this.globalConfig = {
      ...this.globalConfig,
      ...globalConfig,
    }
  }

  public start() {
    if (!this.timer) {
      this.run();
    }
  }

  public stop() {
    if (this.timer) {
      window.cancelAnimationFrame(this.timer);
      this.timer = null;
    }
  }

  public clear() {
    this.spriteInstances = {};
  }

  public destroy() {
    this.stop();
    this.clear();
  }

  private run = () => {
    this.tryToAddSprite();

    this.render();

    this.timer = window.requestAnimationFrame(this.run);
  };

  private drawTemplateCanvas() {
    this.globalConfig.templateCtx.clearRect(
      0, 0,
      this.globalConfig.containerWidth, this.globalConfig.containerHeight,
    );

    Object.keys(this.spriteInstances).forEach(uid => {
      const sprite = this.spriteInstances[uid];

      sprite.animation();

      if (!sprite.status) {
        delete this.spriteInstances[uid];
      } else {
        sprite.render(this.globalConfig.templateCtx);
      }
    });
  }

  private render() {
    this.drawTemplateCanvas();

    this.globalConfig.ctx.clearRect(
      0, 0,
      this.globalConfig.containerWidth, this.globalConfig.containerHeight,
    );
    this.globalConfig.ctx.drawImage(
      this.globalConfig.templateCanvas,
      0, 0,
    )
  }
}

export default Scene
