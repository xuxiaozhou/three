import {loadingImage, mixConfig} from "./utils";
import {
  IAnimationData,
  ISprite,
  IFont, IGlobalConfig, IStyle, IRoundImageArgs, IPos,
} from "./interface";
import {defaultSpriteConfig, imageAndTextSpace, employTrackSpaceX} from "./constant";

class Sprite {
  public status: boolean = true;
  private speed: [number, number] = [1, 1];

  private avatar: CanvasImageSource | string;
  private readonly content: string;
  public position: [number, number] = null;

  public rect: [number, number];
  private rangeWidth?: [number, number];

  private templateCtx: CanvasRenderingContext2D;
  private style: IStyle;
  private font: IFont;
  private readonly templateCanvas: HTMLCanvasElement;

  // 占用起飞跑道标志
  public employTrack = false;

  public id: string;

  private set avatarStatus(status) {
    if (status) {
      this.getImageData();
    }
  }

  public constructor(spriteArgs: ISprite, globalConfig: IGlobalConfig) {
    const {
      avatar,
      fontFamily,
      fontColor,
      fontSize,
      avatarSize,
      content,
      padding,
      radius,
    } = mixConfig(spriteArgs, defaultSpriteConfig) as ISprite;
    this.content = content;
    this.style = {
      padding,
      avatarSize,
      radius
    };
    this.font = {
      fontFamily,
      fontColor,
      fontSize,
    };

    this.loadingImage(avatar);

    this.rect = this.calcRect(globalConfig.ctx);
    const canvas = document.createElement('canvas');
    canvas.width = this.rect[0];
    canvas.height = this.rect[1];
    this.templateCanvas = canvas;

    this.getImageData();
  }

  private getImageData() {
    this.templateCtx = this.templateCanvas.getContext('2d');
    this.templateCtx.clearRect(0, 0, this.rect[0], this.rect[1]);
    this.draw(this.templateCtx);
  }

  public render(ctx) {
    ctx.drawImage(
      this.templateCanvas,
      ...this.position
    )
  }

  private loadingImage(avatar) {
    (async () => {
      if (avatar) {
        // 头像
        this.avatar = await loadingImage(avatar) || null;
        this.avatarStatus = true;
      }
    })()
  }

  // 计算尺寸
  private calcRect(ctx: CanvasRenderingContext2D): [number, number] {
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = this.style.padding;
    ctx.save();
    ctx.font = `${this.font.fontSize}px ${this.font.fontFamily}`;
    const measureText = ctx.measureText(this.content);
    ctx.restore();

    const barrageAllWidth = (
      this.style.avatarSize + imageAndTextSpace + measureText.width +
      paddingLeft + paddingRight
    );

    const barrageAllHeight = (
      Math.max(this.style.avatarSize, this.font.fontSize) +
      paddingTop + paddingBottom
    );
    return [Math.floor(barrageAllWidth), barrageAllHeight];
  }

  // 设置关于运动的参数
  public setAnimation({position, speed, rangeWidth}: IAnimationData) {
    this.position = position;
    this.speed = speed;
    this.rangeWidth = rangeWidth;
  }

  private draw(ctx: CanvasRenderingContext2D) {
    const [, , left] = this.style.padding;

    // 头像
    const avatarSpaceTop = (this.rect[1] - this.style.avatarSize) / 2;
    if (this.avatar && typeof this.avatar !== 'string') {
      Sprite.drawAvatar(
        ctx,
        {
          img: this.avatar,
          position: [left, avatarSpaceTop],
          imageHeight: this.style.avatarSize,
          imageWidth: this.style.avatarSize,
          radius: this.style.radius,
        }
      );
    } else {
      // todo 留出位置
    }

    const textSpaceTop = (this.rect[1] - this.font.fontSize - 5) / 2;
    this.drawText(ctx, {
      left: this.style.avatarSize + imageAndTextSpace + left,
      top: textSpaceTop
    });

    this.drawBorder(ctx);
  }

  private static checkEmployTrack({left, width, type, containerWidth}) {
    if (type === 'reversescroll') {
      if (left > employTrackSpaceX) {
        return false;
      }
    }

    if (type === 'scroll') {
      if (left < containerWidth - width - employTrackSpaceX) {
        return false;
      }
    }

    return true
  }

  public animation({type, containerWidth}) {
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
      this.employTrack = Sprite.checkEmployTrack({
        left,
        type,
        containerWidth,
        width: this.rect[0],
      });
    }
  }

  public remove() {
    this.status = false
  }

  private drawBorder(ctx: CanvasRenderingContext2D, pos: IPos = {}) {
    const {left = 0, top = 0} = pos;
    const [barrageAllWidth, barrageAllHeight] = this.rect;
    //x轴方向的阴影偏移量,负数为向右偏移量
    ctx.shadowOffsetX = 3;
    //y轴方向的阴影偏移量,负数为向上偏移量
    ctx.shadowOffsetY = 3;
    //阴影模糊强度
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(46, 141, 239, 0.4)";
    ctx.strokeStyle = 'rgba(46, 141, 239, 1)';
    ctx.strokeRect(
      left, top,
      barrageAllWidth,
      barrageAllHeight,
    );
  }

  private drawText(ctx: CanvasRenderingContext2D, {left = 0, top = 0}: { top: number, left: number }) {
    ctx.fillStyle = this.font.fontColor;
    ctx.font = `${this.font.fontSize}px ${this.font.fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      this.content,
      left,
      top
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

}

export default Sprite;
