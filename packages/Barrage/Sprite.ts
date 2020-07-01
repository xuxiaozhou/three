import {loadingImage} from "./utils";

type IPosition = [number, number]

interface ISprite {
  texture?: string,
  text?: string,
  position?: IPosition,
  imageSize?: number,
  radius?: number,
  fontSize?: number,
  fontColor?: string,
  fontFamily?: string,
}

interface IRoundImageArgs {
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  position: IPosition,
  radius?: number,
  imageWidth: number,
  imageHeight: number
}

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

class Sprite {
  private texture: CanvasImageSource | string;
  private readonly imageSize: number = 100;
  private position: [number, number] = [0, 0];

  private readonly padding: [number, number, number, number];
  private readonly radius: number = 20;
  private readonly text: string;
  private readonly fontSize: number;
  private readonly fontColor: string;
  private readonly fontFamily: string;
  // private rect: number[] = [0, 0];

  public constructor(spriteArgs: ISprite) {
    const {
      texture,
      position,
      text,
      fontSize = 36,
      fontColor = '#fff',
      fontFamily = 'Microsoft YaHei',
      imageSize = 50,
      radius = 6
    } = spriteArgs;
    this.texture = texture;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.text = text;
    this.imageSize = imageSize;
    this.position = position || [100, 100];
    this.radius = radius;
    this.padding = [12, 12, 12, 12];

    (async () => {
      if (this.texture) {
        this.texture = await loadingImage(this.texture)
      }
    })();
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    const [left, top] = this.position;
    let barrageWidth = 0;

    // 头像
    if (typeof this.texture !== 'string') {
      roundRect({
          ctx,
          img: this.texture,
          position: [left, top],
          imageHeight: this.imageSize,
          imageWidth: this.imageSize,
          radius: this.radius,
        }
      );
      barrageWidth += this.imageSize;
    }

    ctx.fillStyle = this.fontColor;
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const a = ctx.measureText(this.text);
    const imageAndTextSpace = 12;
    barrageWidth += a.width + imageAndTextSpace;
    const space = this.fontSize < this.imageSize ? (this.imageSize - this.fontSize) / 2 : 0;
    ctx.fillText(this.text, this.imageSize + left + imageAndTextSpace, top + space);

    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = this.padding;
    //x轴方向的阴影偏移量,负数为向右偏移量
    ctx.shadowOffsetX = 3;
    //y轴方向的阴影偏移量,负数为向上偏移量
    ctx.shadowOffsetY = 3;
    //阴影模糊强度
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(46, 141, 239, 0.4)";
    ctx.strokeStyle = 'rgba(46, 141, 239, 1)';

    const barrageAllWidth = barrageWidth + paddingLeft + paddingRight;
    const barrageAllHeight = this.imageSize + paddingTop + paddingBottom;
    ctx.strokeRect(
      left - paddingLeft, top - paddingTop,
      barrageAllWidth,
      barrageAllHeight,
    );

    // this.rect = [barrageAllWidth, barrageAllHeight];
    ctx.restore();
  }

  public animation() {
    // {containerWidth, containerHeight}
    // const [barrageAllWidth, barrageAllHeight] = this.rect;

    this.position = [this.position[0] + 1, this.position[1] + 1]
  }
}

export default Sprite;
