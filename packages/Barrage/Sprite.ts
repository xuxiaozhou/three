import {loadingImage} from "./utils";
import {IRoundImageArgs, ISprite} from "./interface";

const roundRect = (roundImageArgs: IRoundImageArgs) => {
  const {
    ctx,
    img,
    position,
    imageWidth,
    imageHeight,
  } = roundImageArgs;
  let {radius} = roundImageArgs;

  radius = radius > Math.max(imageWidth, imageHeight) / 2 ? Math.max(imageHeight, imageWidth) / 2 : radius;
  const [x, y] = position;
  const {width, height} = img as { width: number, height: number };

  ctx.save();

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

  ctx.drawImage(
    img,
    0, 0, width, height,
    x, y, imageWidth, imageHeight
  );

  ctx.restore();
};
const imageAndTextSpace = 12;

class Sprite {
  public status: boolean = true;
  private speed: [number, number] = [1, 1];

  private avatar: CanvasImageSource | string;
  private readonly imageSize: number = 100;
  private position: [number, number] = null;

  private readonly padding: [number, number, number, number];
  private readonly radius: number = 20;
  private readonly content: string;
  private readonly fontSize: number;
  private readonly fontColor: string;
  private readonly fontFamily: string;
  private rect: [number, number];
  private range: [number, number];

  public constructor(spriteArgs: ISprite) {
    const {
      avatar,
      content,
      fontSize = 36,
      fontColor = '#fff',
      fontFamily = 'Microsoft YaHei',
      imageSize = 50,
      radius = 6
    } = spriteArgs;
    this.avatar = avatar;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.content = content;
    this.imageSize = imageSize;
    this.radius = radius;
    this.padding = [12, 12, 12, 12];

    (async () => {
      if (this.avatar) {
        // todo 默认图片
        this.avatar = await loadingImage(this.avatar) || ''
      }
    })();
  }

  // 计算尺寸
  public calcRect(ctx): [number, number] {
    if (this.rect) {
      return this.rect;
    }

    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = this.padding;
    ctx.save();
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    const measureText = ctx.measureText(this.content);
    ctx.restore();

    const barrageAllWidth = (
      this.imageSize + imageAndTextSpace + measureText.width +
      paddingLeft + paddingRight
    );

    const barrageAllHeight = (
      Math.max(this.imageSize, this.fontSize) +
      paddingTop + paddingBottom
    );
    this.rect = [barrageAllWidth, barrageAllHeight];

    return this.rect;
  }

  // 设置关于运动的参数
  public setAnimation({position, speed, range}) {
    this.position = position;
    this.speed = speed;
    this.range = range;
  }

  // todo 缓存优化
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    const [left, top] = this.position;

    // 头像
    if (typeof this.avatar !== 'string') {
      roundRect({
          ctx,
          img: this.avatar,
          position: [left, top],
          imageHeight: this.imageSize,
          imageWidth: this.imageSize,
          radius: this.radius,
        }
      );
    } else {
      // todo 留出位置
    }

    ctx.fillStyle = this.fontColor;
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const space = this.fontSize < this.imageSize ? (this.imageSize - this.fontSize) / 2 : 0;
    ctx.fillText(this.content, this.imageSize + left + imageAndTextSpace, top + space);

    //x轴方向的阴影偏移量,负数为向右偏移量
    ctx.shadowOffsetX = 3;
    //y轴方向的阴影偏移量,负数为向上偏移量
    ctx.shadowOffsetY = 3;
    //阴影模糊强度
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(46, 141, 239, 0.4)";
    ctx.strokeStyle = 'rgba(46, 141, 239, 1)';

    const [paddingTop, paddingLeft] = this.padding;

    const [barrageAllWidth, barrageAllHeight] = this.calcRect(ctx);
    ctx.strokeRect(
      left - paddingLeft, top - paddingTop,
      barrageAllWidth,
      barrageAllHeight,
    );

    ctx.restore();
  }

  public animation() {
    if (!this.position) {
      return;
    }

    const left = this.position[0] + this.speed[0];
    const top = this.position[1] + this.speed[1];

    if (
      (this.range[0] && left < this.range[0]) ||
      (this.range[1] && top > this.range[1])
    ) {
      this.status = false;
      return;
    }

    this.position = [left, top];
  }

  public remove() {
    this.status = false
  }
}

export default Sprite;
