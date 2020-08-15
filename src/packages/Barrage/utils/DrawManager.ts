import {IDrawOptions, IGlobalConfig, ISpriteConfig, ISize} from "../interface";
import { imageAndTextSpace } from "./constant";

export interface IRoundImageArgs {
  img: CanvasImageSource,
  position: [number, number],
  radius?: number,
  imageWidth: number,
  imageHeight: number
}

class DrawManager {
  private globalConfig: IGlobalConfig;
  private spriteConfig: ISpriteConfig;

  public constructor(spriteConfig: ISpriteConfig, globalConfig: IGlobalConfig) {
    this.globalConfig = globalConfig;
    this.spriteConfig = spriteConfig;
  }

  public calcSize(): ISize {
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = this.spriteConfig.padding;

    let barrageAllWidth = (
      this.spriteConfig.avatarSize + imageAndTextSpace +
      paddingLeft + paddingRight
    );

    let barrageAllHeight = paddingTop + paddingBottom;

    if (this.spriteConfig.type === 'text') {
      this.globalConfig.ctx.save();
      this.globalConfig.ctx.font = `${this.spriteConfig.fontSize}px ${this.spriteConfig.fontFamily}`;
      const measureText = this.globalConfig.ctx.measureText(this.spriteConfig.content);
      this.globalConfig.ctx.restore();
      barrageAllWidth += measureText.width;
      barrageAllHeight += Math.max(this.spriteConfig.avatarSize, this.spriteConfig.fontSize);
    } else {
      barrageAllWidth += this.spriteConfig.imageSize;
      barrageAllHeight += Math.max(this.spriteConfig.avatarSize, this.spriteConfig.imageSize);
    }

    return {
      width: Math.floor(barrageAllWidth),
      height: barrageAllHeight
    };
  }

  public draw(ctx: CanvasRenderingContext2D, options: IDrawOptions) {
    const [, , left] = this.spriteConfig.padding;

    // 头像
    const avatarSpaceTop = (options.height - this.spriteConfig.avatarSize) / 2;
    if (options.avatar && typeof options.avatar !== 'string') {
      DrawManager.drawAvatar(
        ctx,
        {
          img: options.avatar,
          position: [left, avatarSpaceTop],
          imageHeight: this.spriteConfig.avatarSize,
          imageWidth: this.spriteConfig.avatarSize,
          radius: this.spriteConfig.radius,
        }
      );
    } else {
      // todo 留出位置
    }

    if (this.spriteConfig.type === 'text') {
      const textSpaceTop = (options.height - this.spriteConfig.fontSize - 5) / 2;
      this.drawText(ctx, {
        left: this.spriteConfig.avatarSize + imageAndTextSpace + left,
        top: textSpaceTop
      });
    }

    DrawManager.drawBorder(ctx, options);
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
    ctx.fillStyle = this.spriteConfig.fontColor;
    ctx.font = `${this.spriteConfig.fontSize}px ${this.spriteConfig.fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      this.spriteConfig.content,
      left,
      top
    );
  }
}

export default DrawManager;
