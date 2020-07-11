import Sprite from "./Sprite";
import {IGlobalConfig, IAnimationData} from "./interface";
import TrackManager from "./utils/TrackManager";

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

  private calcAnimation(rect, top = 12): IAnimationData {
    const [barrageWidth] = rect;

    if (this.globalConfig.type === 'reversescroll') {
      const speedX = (this.globalConfig.containerWidth + barrageWidth) / this.globalConfig.lifeTime;
      return {
        position: [-barrageWidth, top],
        speed: [speedX, 0],
        rangeWidth: [-barrageWidth, this.globalConfig.containerWidth + barrageWidth]
      }
    }

    // scroll
    const speedX = -(this.globalConfig.containerWidth + barrageWidth) / this.globalConfig.lifeTime;
    return {
      position: [this.globalConfig.containerWidth, top],
      speed: [speedX, 0],
      rangeWidth: [-barrageWidth, this.globalConfig.containerWidth],
    };
  }

  public add(sprite: Sprite) {
    this.needAddSpriteList.push(sprite);
  }

  private addSprite(sprite: Sprite, top: number) {
    sprite.setAnimation(this.calcAnimation(sprite.size, top));
    this.spriteInstances[sprite.id] = sprite;
  }

  private tryToAddSprite() {
    if (this.needAddSpriteList.length === 0) {
      return
    }

    const [sprite] = this.needAddSpriteList;
    const top = this.trackManger.applyPosition(sprite);

    if (top) {
      this.addSprite(sprite, top);
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
    this.globalConfig.templateCtx.clearRect(0, 0, this.globalConfig.containerWidth, this.globalConfig.containerHeight);

    Object.keys(this.spriteInstances).forEach(uid => {
      try {
        const sprite = this.spriteInstances[uid];

        sprite.animation();

        this.trackManger.removeEmployWithNotEmploy(sprite);

        if (!sprite.status) {
          delete this.spriteInstances[uid];
        } else {
          sprite.render(this.globalConfig.templateCtx);
        }
      } catch (e) {
      }
    });
  }

  private render() {
    this.drawTemplateCanvas();

    this.globalConfig.ctx.clearRect(0, 0, this.globalConfig.containerWidth, this.globalConfig.containerHeight);
    this.globalConfig.ctx.drawImage(
      this.globalConfig.templateCanvas,
      0, 0,
    )
  }
}

export default Scene
