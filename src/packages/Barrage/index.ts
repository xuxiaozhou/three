import Scene from "./element/Scene";
import Sprite from "./element/Sprite";
import {IGlobalConfig, ISpriteConfig, ICalcGlobalConfig} from "./interface";
import {getRandomColor, mixConfig} from "./utils/utils";
import {createCanvas} from "../utils/utils";
import loadImage from "./utils/loadImage";
import {defaultGlobalConfig, defaultSpriteConfig, screenSpace} from './utils/constant'

class Barrage {
  private readonly scene: Scene;
  public stop: () => void;
  public start: () => void;
  public clear: () => void;

  private readonly globalConfig: IGlobalConfig;
  private readonly container: HTMLElement;

  public constructor(container: HTMLElement, globalConfig: IGlobalConfig = {}) {
    this.globalConfig = mixConfig(globalConfig, defaultGlobalConfig) as IGlobalConfig;

    this.container = container;
    this.globalConfig.canvas = this.initCanvas(true);
    this.globalConfig.templateCanvas = this.initCanvas();
    this.globalConfig.templateSpriteCanvas = this.initCanvas();
    this.globalConfig.templateCtx = this.globalConfig.templateCanvas.getContext('2d');
    this.globalConfig.ctx = this.globalConfig.canvas.getContext('2d');
    this.globalConfig = {
      ...this.globalConfig,
      ...this.calcData(),
    };

    // 创建场景
    this.scene = new Scene(this.globalConfig);

    this.stop = this.scene.stop.bind(this.scene);
    this.start = this.scene.start.bind(this.scene);
    this.clear = this.scene.clear.bind(this.scene);

    window.addEventListener('resize', this.resize);
  }

  public async add(spriteConfig: ISpriteConfig) {
    spriteConfig = mixConfig(spriteConfig, defaultSpriteConfig);
    if (!spriteConfig.fontColor) {
      spriteConfig.fontColor = getRandomColor();
    }

    try {
      if (spriteConfig.avatar && typeof spriteConfig.avatar === 'string') {
        spriteConfig.avatar = await loadImage(spriteConfig.avatar)
      }
    } catch (e) {
    }

    try {
      if (spriteConfig.image && typeof spriteConfig.image === 'string') {
        spriteConfig.image = await loadImage(spriteConfig.image)
      }
    } catch (e) {
    }

    // 预加载图片
    this.scene.add(
      new Sprite(
        spriteConfig,
        this.globalConfig,
      )
    );
  }

  public destroy() {
    this.scene.destroy();
    window.removeEventListener('resize', this.resize);
  }

  private resize = () => {
    const globalConfig = this.calcData();
    const {
      containerHeight,
      containerWidth,
    } = globalConfig;

    this.globalConfig.canvas.width = containerWidth;
    this.globalConfig.canvas.height = containerHeight;
    this.globalConfig.templateCanvas.width = containerWidth;
    this.globalConfig.templateCanvas.height = containerHeight;

    this.scene.resetGlobalConfig(globalConfig);
  };

  private initCanvas(isTemplate = false): HTMLCanvasElement {
    const {offsetWidth, offsetHeight} = this.container;
    const canvas = createCanvas('canvas-huiyidun', offsetWidth, offsetHeight);

    if (isTemplate) {
      canvas.style.position = 'absolute';
      canvas.style.display = 'block';
      this.container.append(canvas);
    }

    return canvas;
  }

  private calcData(): ICalcGlobalConfig {
    const {
      offsetWidth: containerWidth,
      offsetHeight: containerHeight,
    } = this.container;
    // 轨道Y轴返回
    const trackRange: [number, number] = [screenSpace, containerHeight - screenSpace];

    return {
      containerHeight,
      containerWidth,
      trackRange,
    }
  }
}

export default Barrage;
