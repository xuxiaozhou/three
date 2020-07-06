import Sprite from "./Sprite";
import {getCanUseTrack} from "./utils";
import {createId} from "../utils/utils";
import {IGlobalConfig, IAnimationData} from "./interface";
import {screenSpace} from "./constant";
import {createCanvas} from "../utils/utils";

let STATUS = false;

class Scene {
  private container: HTMLElement;
  private containerWidth: number;
  private containerHeight: number;
  private globalConfig: IGlobalConfig;
  private trackTop: [number, number];

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

  public ctx: CanvasRenderingContext2D;

  private sprites: { [x: string]: Sprite } = {};

  private queue: Sprite[] = [];

  private employTrack: { [spriteId: string]: string } = {};

  public constructor(container: HTMLElement, globalConfig: IGlobalConfig) {
    this.initCanvas(container);
    this.globalConfig = globalConfig;
    this.status = true;
    window.addEventListener('resize', this.resize.bind(this));
  }

  private calcAnimation(rect, top = 12): IAnimationData {
    const [barrageWidth] = rect;

    if (this.globalConfig.type === 'reversescroll') {
      const speedX = (this.containerWidth + barrageWidth) / this.globalConfig.lifeTime;
      return {
        position: [-barrageWidth, top],
        speed: [speedX, 0],
        rangeWidth: [-barrageWidth, this.containerWidth + barrageWidth]
      }
    }

    // scroll
    const speedX = -(this.containerWidth + barrageWidth) / this.globalConfig.lifeTime;
    return {
      position: [this.containerWidth, top],
      speed: [speedX, 0],
      rangeWidth: [-barrageWidth, this.containerWidth],
    };
  }

  public add(sprite: Sprite) {
    sprite.id = createId('sprite-');
    this.queue.push(sprite);
  }

  private addSprite(sprite: Sprite, top: number) {
    sprite.setAnimation(this.calcAnimation(sprite.rect, top));
    this.sprites[sprite.id] = sprite;
  }

  private calcEmployTrack(height: number): null | [number, number] {
    const employ = Object.values(this.employTrack);
    const employTrackPosition: [number, number] | null = getCanUseTrack(
      employ,
      this.trackTop,
      height,
    );

    if (employTrackPosition) {
      return employTrackPosition;
    }

    return null;
  }

  private calcPosition() {
    if (this.queue.length === 0) {
      return
    }

    const [sprite] = this.queue;
    const [, height] = sprite.rect;

    const employTrackPosition = this.calcEmployTrack(height);
    if (employTrackPosition) {
      this.employTrack[sprite.id] = employTrackPosition.toString();
      sprite.employTrack = true;
      this.addSprite(sprite, employTrackPosition[0]);
      this.queue.shift();
    }
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

    this.calcPosition();
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
    canvas.style.position = 'absolute';
    canvas.style.display = 'block';
    this.container.append(canvas);
    this.ctx = canvas.getContext('2d');

    this.trackTop = [screenSpace, this.containerHeight - screenSpace];
  }

  private render() {
    this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);

    Object.keys(this.sprites).forEach(uid => {
      const sprite = this.sprites[uid];

      sprite.animation({
        type: this.globalConfig.type,
        containerWidth: this.containerWidth,
      });

      if (!sprite.employTrack && this.employTrack[sprite.id]) {
        delete this.employTrack[sprite.id];
      }

      if (!sprite.status) {
        delete this.sprites[uid];
      } else {
        sprite.render(this.ctx);
      }
    });
  }
}

export default Scene
