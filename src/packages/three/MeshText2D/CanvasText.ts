import {TextOptions} from "./Text2D";
import {getFontHeight} from "./utils";

export class CanvasText {

    public textWidth: number;
    public textHeight: number;

    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    constructor() {
        this.textWidth = null
        this.textHeight = null

        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
    }

    get width() {
        return this.canvas.width
    }

    get height() {
        return this.canvas.height
    }

    drawText(text: string, ctxOptions: TextOptions) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = ctxOptions.font

        this.textWidth = Math.ceil(this.ctx.measureText(text).width)
        this.textHeight = getFontHeight(this.ctx.font)
        // 判断画布头像
        let image = ctxOptions.canvas;
        if (image) {
            this.textWidth < image.width && (this.textWidth = image.width);
            this.textHeight += image.height + 20;
        }

        this.canvas.width = this.textWidth + 40
        this.canvas.height = this.textHeight+10

        this.ctx.font = ctxOptions.font;

        // 判断背景图片
        if (ctxOptions.bgColor !== 'transparent' && text.length != 0) {
            this.ctx.fillStyle = ctxOptions.bgColor; // white filler
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // 判断画布头像
        if (image) {
            let top = 10
            let left = this.canvas.width / 2 - image.width / 2

            this.ctx.drawImage(image, 0, 0, image.width, image.height, left, top, image.width, image.height)
        }


        this.ctx.fillStyle = ctxOptions.fillStyle;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowColor = ctxOptions.shadowColor;
        this.ctx.shadowBlur = ctxOptions.shadowBlur;
        this.ctx.shadowOffsetX = ctxOptions.shadowOffsetX;
        this.ctx.shadowOffsetY = ctxOptions.shadowOffsetY;
        if (image) {
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height - 10);
        } else {
            this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
        }

        return this.canvas
    }

}
