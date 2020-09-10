import Barrage from "./Barrage";
import {IGlobalConfig} from "./interface";

class Scene {
  private timer: number;

  private queue: Barrage[] = [];

  private barrageInstances: { [id: string]: Barrage } = {};

  private globalConfig: IGlobalConfig;

  public constructor(globalConfig: IGlobalConfig) {
    this.globalConfig = globalConfig;
    this.start();
  }

  public start() {
    if (!this.timer) {
      this.render()
    }
  }

  public add(barrage: Barrage) {
    this.queue.push(barrage)
  }

  public stop() {
    window.cancelAnimationFrame(this.timer)
  }

  public destroy() {
  }

  private tryToAddSprite() {
    if (this.queue.length === 0) {
      return
    }

    const [sprite] = this.queue;
    // const positionY = this.trackManger.applyPosition(sprite);

    // if (positionY) {
    sprite.setAnimation(10);
    this.barrageInstances[sprite.id] = sprite;
    this.queue.shift();
    // }
  }

  private drawTemplateCanvas() {
    this.globalConfig.templateCtx.clearRect(
      0, 0,
      this.globalConfig.container.offsetWidth,
      this.globalConfig.container.offsetHeight
    );

    Object.keys(this.barrageInstances).forEach(uid => {
      const barrage = this.barrageInstances[uid];

      const status = barrage.animation();

      if (!status) {
        delete this.barrageInstances[uid];
      } else {
        barrage.render(this.globalConfig.templateCtx);
      }
    });
  }

  private draw() {
    this.drawTemplateCanvas();
    this.globalConfig.ctx.clearRect(
      0, 0,
      this.globalConfig.container.offsetWidth,
      this.globalConfig.container.offsetHeight,
    );
    this.globalConfig.ctx.drawImage(
      this.globalConfig.templateCanvas,
      0, 0,
    )
  }

  private render = () => {
    this.tryToAddSprite();
    this.draw();

    this.timer = window.requestAnimationFrame(this.render)
  }
}

export default Scene
