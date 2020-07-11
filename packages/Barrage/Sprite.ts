import {IAnimationData, IGlobalConfig, ISpriteConfig, AvatarImage, IDrawOptions,} from "./interface";
import loadImage from "./utils/loadImage";
import DrawManager from "./utils/DrawManager";
import {createCanvas, createId} from "../utils/utils";

const employTrackSpaceX = 20;

class Sprite {
  public id: string;
  public status: boolean = true;
  private position: [number, number] = null;

  private speed: [number, number] = [1, 1];
  // 精灵大小
  public size: [number, number];
  // 运动范围
  private rangeWidth?: [number, number];

  private templateCtx: CanvasRenderingContext2D;
  private avatarImage?: AvatarImage;

  private readonly templateCanvas: HTMLCanvasElement;
  private readonly drawManager: DrawManager;

  // 占用起飞跑道标志
  public employTrack = false;

  private spriteConfig: ISpriteConfig;
  private globalConfig: IGlobalConfig;

  public constructor(spriteConfig: ISpriteConfig, globalConfig: IGlobalConfig) {
    this.id = createId('s-');

    this.spriteConfig = spriteConfig;
    this.globalConfig = globalConfig;
    this.drawManager = new DrawManager(spriteConfig, globalConfig);
    this.size = this.drawManager.calcSize();
    this.templateCanvas = createCanvas(this.id, this.size[0], this.size[1]);

    if (this.spriteConfig.avatar) {
      loadImage(this.spriteConfig.avatar, avatarImage => {
        this.avatarImage = avatarImage;
        this.getImageData();
      });
    }

    this.getImageData();
  }

  private getImageData = () => {
    this.templateCtx = this.templateCanvas.getContext('2d');
    this.templateCtx.clearRect(0, 0, this.size[0], this.size[1]);
    this.drawManager.draw(this.templateCtx, {
      avatarImage: this.avatarImage,
      size: this.size
    } as IDrawOptions);
  };

  public render(ctx) {
    ctx.drawImage(
      this.templateCanvas,
      ...this.position
    )
  }

  // 设置关于运动的参数
  public setAnimation({position, speed, rangeWidth}: IAnimationData) {
    this.position = position;
    this.speed = speed;
    this.rangeWidth = rangeWidth;
  }

  private checkEmployTrack(left) {
    if (this.globalConfig.type === 'reversescroll') {
      if (left > employTrackSpaceX) {
        return false;
      }
    }

    if (this.globalConfig.type === 'scroll') {
      const [width] = this.size;
      if (left < this.globalConfig.containerWidth - width - employTrackSpaceX) {
        return false;
      }
    }

    return true
  }

  public animation() {
    if (!this.position) {
      return;
    }

    const left = this.position[0] + this.speed[0];
    const top = this.position[1] + this.speed[1];

    const offsetWidth = (
      this.rangeWidth &&
      (
        this.rangeWidth[0] > left ||
        this.rangeWidth[1] < left
      )
    );

    if (offsetWidth) {
      this.status = false;
      return;
    }

    this.position = [left, top];

    if (this.employTrack) {
      this.employTrack = this.checkEmployTrack(left);
    }
  }

  public remove() {
    this.status = false
  }
}

export default Sprite;
