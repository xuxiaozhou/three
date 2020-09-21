import {IDrawOptions, IGlobalConfig, ISpriteConfig} from "./interface";
import DrawManager from "./utils/DrawManager";
import {createId} from "../utils/utils";
import loadImage from "./utils/loadImage";

class Sprite {
  public id: string;
  public status: boolean = true;
  private positionX: number;
  private positionY: number;
  private speedX: number;
  private readonly width: number;
  public readonly height: number;

  private readonly drawManager: DrawManager;

  private globalConfig: IGlobalConfig;

  private image: CanvasImageSource;
  private rangeWidthMin: number;
  private rangeWidthMax: number;

  public constructor(spriteConfig: ISpriteConfig, globalConfig: IGlobalConfig) {
    this.id = createId('s-');

    this.globalConfig = globalConfig;

    this.drawManager = new DrawManager(spriteConfig, globalConfig);
    const {width, height} = this.drawManager.calcSize();
    this.width = width;
    this.height = height;

    this.globalConfig.templateSpriteCanvas.width = width;
    this.globalConfig.templateSpriteCanvas.height = height;
    const templateCtx = this.globalConfig.templateSpriteCanvas.getContext('2d');
    templateCtx.clearRect(0, 0, width, height);
    this.drawManager.draw(templateCtx, {
      avatar: spriteConfig.avatar,
      image: spriteConfig.image,
      width: this.width,
      height: this.height,
    } as IDrawOptions);
    const imageUrl = this.globalConfig.templateSpriteCanvas.toDataURL();
    loadImage(imageUrl).then(image => {
      this.image = image;
    });

    this.prepareData();
  }

  private prepareData() {
    if (this.globalConfig.type === 'reversescroll') {
      this.speedX = (this.globalConfig.containerWidth + this.width) / this.globalConfig.lifeTime
      this.positionX = -this.width;
      this.rangeWidthMin = -this.width;
      this.rangeWidthMax = this.globalConfig.containerWidth + this.width
    }

    // scroll
    this.speedX = -(this.globalConfig.containerWidth + this.width) / this.globalConfig.lifeTime;
    this.positionX = this.globalConfig.containerWidth;
    this.rangeWidthMin = -this.width;
    this.rangeWidthMax = this.globalConfig.containerWidth;
  }

  public render(ctx) {
    if (this.image) {
      ctx.drawImage(
        this.image,
        this.positionX,
        this.positionY,
      )
    }
  }

  // 设置关于运动的参数
  public setAnimation(positionY: number) {
    this.positionY = positionY;
  }

  public animation() {
    if (!this.positionY || !this.speedX) {
      return;
    }

    this.positionX += this.speedX;

    const overflowScreen = (
      this.rangeWidthMax && this.rangeWidthMin &&
      (
        this.rangeWidthMin > this.positionX ||
        this.rangeWidthMax < this.positionX
      )
    );

    if (overflowScreen) {
      this.status = false;
    }
  }

  public remove() {
    this.status = false
  }
}

export default Sprite;
