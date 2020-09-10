import {IBarrageConfig, IGlobalConfig, IPropGlobalConfig} from "./interface";
import Scene from "./scene";
import {createCanvas, mixConfig} from "../utils/utils";
import Barrage from "./Barrage";
import loadImage from "../utils/loadImage";

class Main {
  private globalConfig: IGlobalConfig;
  private readonly scene: Scene;

  public start: () => void;
  public stop: () => void;
  public destroy: () => void;

  private readonly container: HTMLElement;

  private readonly canvas: HTMLCanvasElement;
  private readonly templateCanvas: HTMLCanvasElement;

  public constructor(globalConfig: IPropGlobalConfig) {
    this.container = globalConfig.container;
    this.canvas = this.initCanvas(true);
    this.templateCanvas = this.initCanvas();

    // 准备全局配置
    this.prepareGlobalConfig(globalConfig);
    this.scene = new Scene(this.globalConfig);
    this.start = this.scene.start.bind(this.scene);
    this.stop = this.scene.stop.bind(this.scene);
    this.destroy = () => {
      window.removeEventListener('resize', this.resize);
      this.scene.destroy()
    };

    window.addEventListener('resize', this.resize);
  }

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

  private prepareGlobalConfig(globalConfig: IGlobalConfig) {
    const defaultGlobalConfig: IPropGlobalConfig = {
      type: 'scroll',
      lifeTime: 200,
    };

    this.globalConfig = {
      ...mixConfig(globalConfig, defaultGlobalConfig),
      canvas: this.canvas,
      ctx: this.canvas.getContext('2d'),
      templateCanvas: this.templateCanvas,
      templateCtx: this.templateCanvas.getContext('2d'),
      templateBarrageCanvas: this.initCanvas()
    }
  }

  // 准备弹幕
  private static prepareBarrageConfig(config: IBarrageConfig): IBarrageConfig {
    const defaultSpriteConfig: IBarrageConfig = {
      fontSize: 36,
      fontFamily: 'Microsoft YaHei',
      avatarSize: 50,
      padding: [12, 12, 12, 12],
      radius: 20,
      fontColor: '#fff'
    };

    return mixConfig(config, defaultSpriteConfig);
  }

  // 添加弹幕
  public async addBarrage(barrageConfig: IBarrageConfig) {
    barrageConfig = Main.prepareBarrageConfig(barrageConfig);

    if (barrageConfig.avatar) {
      try {
        barrageConfig.avatar = await loadImage(barrageConfig.avatar as string)
      } catch (e) {
      }
    }

    this.scene.add(
      new Barrage(barrageConfig, this.globalConfig)
    )
  }

  // 调整大小
  private resize = () => {
  }
}

export default Main
