import Sprite from "./Sprite";
import {createCanvas} from "./utils";

interface IGlobalConfig {
  container: HTMLElement,
}

let STATUS = false;

class Scene {
  private container: HTMLElement;
  private containerWidth: number;
  private containerHeight: number;

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

  private sprites: Sprite[] = [];

  public constructor({container}: IGlobalConfig) {
    this.initCanvas(container);
    this.status = true;
    window.addEventListener('resize', this.resize.bind(this));
  }

  public add(sprite: Sprite) {
    this.sprites.push(sprite);
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
    this.sprites.forEach(sprite => {
      sprite.animation();
      sprite.draw(this.ctx);
    })
  }

  private run() {
    this.render();
    const run = this.run.bind(this);
    this.timer = window.requestAnimationFrame(run);
  }

  public start() {
    this.status = true;
  }

  public stop() {
    this.timer = null;
    this.status = false;
  }
}

export default Scene
