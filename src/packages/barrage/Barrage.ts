import {IBarrageConfig, IGlobalConfig} from "./interface";
import loadImage from "../utils/loadImage";
import {createId} from "../utils/utils";

const avatarAndTextSpace = 12;

export interface ISize {
  width: number,
  height: number
}

export type AvatarImage = string | CanvasImageSource;

export interface IDrawOptions extends ISize {
  avatar?: AvatarImage,
}

export interface IRoundImageArgs {
  img: CanvasImageSource,
  position: [number, number],
  radius?: number,
  imageWidth: number,
  imageHeight: number
}

class Barrage {
  private barrageConfig: IBarrageConfig;
  private globalConfig: IGlobalConfig;
  private barrageAllWidth: number;
  private barrageAllHeight: number;
  private image: CanvasImageSource;
  private speedX: number;
  private positionX: number;
  private positionY: number = null;
  private rangeWidthMin: number;
  private rangeWidthMax: number;
  public id: string;
  private startTime: number;

  public constructor(barrageConfig: IBarrageConfig, globalConfig: IGlobalConfig) {
    this.barrageConfig = barrageConfig;
    this.globalConfig = globalConfig;
    this.id = createId('s-');

    this.calcSize();
    this.resetBarrageCanvas();
  }

  private static drawBorder(ctx: CanvasRenderingContext2D, options: IDrawOptions) {
    //x轴方向的阴影偏移量,负数为向右偏移量
    ctx.shadowOffsetX = 3;
    //y轴方向的阴影偏移量,负数为向上偏移量
    ctx.shadowOffsetY = 3;
    //阴影模糊强度
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(46, 141, 239, 0.4)";
    ctx.strokeStyle = 'rgba(46, 141, 239, 1)';
    ctx.strokeRect(
      0, 0,
      options.width,
      options.height,
    );
  }

  private static drawAvatar(ctx, roundImageArgs: IRoundImageArgs) {
    const {
      img,
      imageWidth,
      imageHeight,
      position,
    } = roundImageArgs;
    let {radius} = roundImageArgs;

    radius = radius > Math.max(imageWidth, imageHeight) / 2 ? Math.max(imageHeight, imageWidth) / 2 : radius;
    const [x, y] = position;

    ctx.save();

    if (img) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + imageWidth - radius, y);
      ctx.quadraticCurveTo(x + imageWidth, y, x + imageWidth, y + radius);
      ctx.lineTo(x + imageWidth, y + imageHeight - radius);
      ctx.quadraticCurveTo(x + imageWidth, y + imageHeight, x + imageWidth - radius, y + imageHeight);
      ctx.lineTo(x + radius, y + imageHeight);
      ctx.quadraticCurveTo(x, y + imageHeight, x, y + imageHeight - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.clip();

      const {width, height} = img as { width: number, height: number };

      ctx.drawImage(
        img,
        0, 0, width, height,
        x, y, imageWidth, imageHeight
      );
    } else {
    }

    ctx.restore();
  };

  private drawText(ctx: CanvasRenderingContext2D, {left = 0, top = 0}: { top: number, left: number }) {
    ctx.fillStyle = this.barrageConfig.fontColor;
    ctx.font = `${this.barrageConfig.fontSize}px ${this.barrageConfig.fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      this.barrageConfig.content,
      left,
      top
    );
  }

  private draw(ctx: CanvasRenderingContext2D, options: IDrawOptions) {
    const [, , left] = this.barrageConfig.padding;

    // 头像
    const avatarSpaceTop = (options.height - this.barrageConfig.avatarSize) / 2;
    if (options.avatar && typeof options.avatar !== 'string') {
      Barrage.drawAvatar(
        ctx,
        {
          img: options.avatar,
          position: [left, avatarSpaceTop],
          imageHeight: this.barrageConfig.avatarSize,
          imageWidth: this.barrageConfig.avatarSize,
          radius: this.barrageConfig.radius,
        }
      );
    } else {
      // todo 留出位置
    }

    const textSpaceTop = (options.height - this.barrageConfig.fontSize - 5) / 2;
    this.drawText(ctx, {
      left: this.barrageConfig.avatarSize + avatarAndTextSpace + left,
      top: textSpaceTop
    });

    Barrage.drawBorder(ctx, options);
  }

  private resetBarrageCanvas() {
    this.globalConfig.templateBarrageCanvas.width = this.barrageAllWidth;
    this.globalConfig.templateBarrageCanvas.height = this.barrageAllHeight;
    const templateCtx = this.globalConfig.templateBarrageCanvas.getContext('2d');
    templateCtx.clearRect(0, 0, this.barrageAllWidth, this.barrageAllHeight);
    this.draw(templateCtx, {
      avatar: this.barrageConfig.avatar,
      width: this.barrageAllWidth,
      height: this.barrageAllHeight,
    });
    const imageUrl = this.globalConfig.templateBarrageCanvas.toDataURL();
    loadImage(imageUrl).then(image => {
      this.image = image;
    });

    this.prepareData();
  }

  private prepareData() {
    if (this.globalConfig.type === 'reversescroll') {
      this.speedX = (this.globalConfig.container.offsetWidth + this.barrageAllWidth) / this.globalConfig.lifeTime
      this.positionX = -this.barrageAllWidth;
      this.rangeWidthMin = -this.barrageAllWidth;
      this.rangeWidthMax = this.globalConfig.container.offsetWidth + this.barrageAllWidth
    }

    // scroll
    this.speedX = -(this.globalConfig.container.offsetWidth + this.barrageAllWidth) / this.globalConfig.lifeTime;
    this.positionX = this.globalConfig.container.offsetWidth;
    this.rangeWidthMin = -this.barrageAllWidth;
    this.rangeWidthMax = this.globalConfig.container.offsetWidth;
  }

  private calcSize() {
    const [paddingTop = 0, paddingRight = 0, paddingBottom = 0, paddingLeft = 0] = this.barrageConfig.padding;

    let barrageAllWidth = (
      this.barrageConfig.avatarSize + avatarAndTextSpace
      + paddingLeft + paddingRight
    );
    let barrageAllHeight = paddingTop + paddingBottom;
    this.globalConfig.ctx.save();
    this.globalConfig.ctx.font = `${this.barrageConfig.fontSize}px ${this.barrageConfig.fontFamily}`;
    const measureText = this.globalConfig.ctx.measureText(this.barrageConfig.content);
    this.globalConfig.ctx.restore();
    barrageAllWidth += measureText.width;
    barrageAllHeight += Math.max(this.barrageConfig.avatarSize, this.barrageConfig.fontSize);

    this.barrageAllWidth = Math.floor(barrageAllWidth)
    this.barrageAllHeight = barrageAllHeight
  }

  public animation(): boolean {
    if (!this.positionY || !this.speedX) {
      return true;
    }

    this.positionX += this.speedX;

    const overflowScreen = (
      this.rangeWidthMax && this.rangeWidthMin &&
      (
        this.rangeWidthMin > this.positionX ||
        this.rangeWidthMax < this.positionX
      )
    );

    return !overflowScreen;
  }

  public setAnimation(positionY: number) {
    this.positionY = positionY;
  }

  public render(ctx) {
    if (this.image || this.positionY !== null) {
      if (!this.startTime) {
        this.startTime = Date.now();
        console.log(this.startTime);
      }
      ctx.drawImage(
        this.image,
        this.positionX,
        this.positionY,
      )
    }
  }
}

export default Barrage
