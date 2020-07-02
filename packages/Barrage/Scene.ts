import Sprite from "./Sprite";
import {createCanvas} from "./utils";
import {createId} from "../utils/utils";
import {IGlobalConfig, IType} from "./interface";

let STATUS = false;

class Scene {
  private container: HTMLElement;
  private containerWidth: number;
  private containerHeight: number;
  private readonly type: IType;

  private static get status() {
    return STATUS;
  }

  private set status(status: boolean) {
    if (STATUS === status) {
      return
    }

    STATUS = status;

    if (!STATUS) {
      this.stop();
      return;
    }

    if (this.timer !== null) {
      return;
    }

    this.run();
  }

  private timer = null;

  private ctx: CanvasRenderingContext2D;

  private sprites: { [x: string]: Sprite } = {};

  public constructor(container: HTMLElement, globalConfig: IGlobalConfig) {
    this.initCanvas(container);
    this.type = globalConfig.type || 'scroll';
    this.status = true;
    window.addEventListener('resize', this.resize.bind(this));
  }

  public add(sprite: Sprite) {
    // todo 计算位置，速度
    const rect = sprite.calcRect(this.ctx);
    if (this.type === 'scroll') {
      sprite.setAnimation({
        position: [this.containerWidth, rect[1]],
        speed: [-1, 0],
        range: [-rect[0]],
      });
    }
    this.sprites[createId('sprite-')] = sprite;
  }

  public start() {
    this.status = true;
  }

  public stop() {
    this.timer = null;
    this.status = false;
  }

  public clear() {
    this.sprites = {};
  }

  private run() {
    if (!Scene.status) {
      return;
    }

    this.render();
    const run = this.run.bind(this);
    this.timer = window.requestAnimationFrame(run);
  }

  private resize() {
    this.containerWidth = this.container.offsetWidth;
    this.containerHeight = this.container.offsetHeight;
  }

  private initCanvas(container: HTMLElement) {
    const {offsetWidth, offsetHeight} = container;
    this.container = container;
    this.containerWidth = offsetWidth;
    this.containerHeight = offsetHeight;
    const canvas = createCanvas('canvas-huiyidun', offsetWidth, offsetHeight);
    this.container.append(canvas);
    this.ctx = canvas.getContext('2d');
  }

  private render() {
    this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
    Object.keys(this.sprites).forEach(uid => {
      const sprite = this.sprites[uid];
      if (!sprite.status) {
        delete this.sprites[uid];
      } else {
        sprite.animation();
        sprite.draw(this.ctx);
      }
    });
  }
}

export default Scene
