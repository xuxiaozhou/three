'use strict';

const defaultSpriteConfig = {
    fontSize: 36,
    fontColor: '#fff',
    fontFamily: 'Microsoft YaHei',
    avatarSize: 50,
    type: 'text',
    padding: [12, 12, 12, 12],
    radius: 20,
};
const defaultGlobalConfig = {
    type: 'scroll',
    lifeTime: 200,
};
const imageAndTextSpace = 12;
const screenSpace = 32;
const employTrackSpaceX = 20;
const employTrackSpaceY = 20;

const loadingImage = (src) => {
    return new Promise(resolve => {
        const image = new Image();
        image.crossOrigin = '';
        image.src = src;
        image.onload = () => {
            resolve(image);
        };
        image.onerror = () => {
            resolve(null);
        };
    });
};
const mixConfig = (config, defaultConfig) => {
    Object.keys(defaultConfig).forEach(key => {
        if (typeof config[key] === 'undefined') {
            config[key] = defaultConfig[key];
        }
    });
    return config;
};
function getCanUseTrack(employTrack, allTrack, height) {
    const spaceTracks = [];
    if (employTrack.length !== 0) {
        const useTrack = employTrack
            .map(range => (range.split(',').map(value => parseFloat(value))))
            .sort((a, b) => (a[0] > b[0] ? 1 : -1));
        const tracks = [];
        useTrack.forEach((track, index) => {
            if (index === 0) {
                tracks.push(track);
                return;
            }
            const prevTrack = tracks[tracks.length - 1];
            const [min, max] = track;
            if (prevTrack[1] + employTrackSpaceY > min) {
                prevTrack[1] = max;
                return;
            }
            tracks.push(track);
        });
        const [start] = tracks[0];
        const [, end] = tracks[tracks.length - 1];
        if (allTrack[0] < start) {
            spaceTracks.push([allTrack[0], start]);
        }
        if (allTrack[1] > end) {
            spaceTracks.push([end, allTrack[1]]);
        }
        if (tracks.length > 1) {
            let startTrack;
            tracks.forEach(track => {
                if (startTrack === undefined) {
                    startTrack = track[1];
                }
                else {
                    spaceTracks.push([startTrack, track[0]]);
                    startTrack = track[0];
                }
            });
        }
    }
    else {
        spaceTracks.push([...allTrack]);
    }
    for (let i = 0; i < spaceTracks.length; i += 1) {
        const spaceTrack = spaceTracks[i];
        if (spaceTrack[1] - spaceTrack[0] > height + employTrackSpaceY) {
            return [spaceTrack[0], spaceTrack[0] + height + employTrackSpaceY];
        }
    }
    return null;
}

function createId(pre = '') {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function guid() {
        return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
    }
    return pre + guid();
}
const createCanvas = (id, containerWidth, containerHeight) => {
    const element = window.document.createElement('canvas');
    element.id = id;
    element.width = containerWidth;
    element.height = containerHeight;
    return element;
};

let STATUS = false;
class Scene {
    constructor(container, globalConfig) {
        this.timer = null;
        this.sprites = {};
        this.queue = [];
        this.employTrack = {};
        this.initCanvas(container);
        this.globalConfig = globalConfig;
        this.status = true;
        window.addEventListener('resize', this.resize.bind(this));
    }
    static get status() {
        return STATUS;
    }
    set status(status) {
        if (STATUS === status) {
            return;
        }
        STATUS = status;
        if (!STATUS) {
            this.stop();
            return;
        }
        if (this.timer !== null) {
            return;
        }
        this.run();
    }
    calcAnimation(rect, top = 12) {
        const [barrageWidth] = rect;
        if (this.globalConfig.type === 'reversescroll') {
            const speedX = (this.containerWidth + barrageWidth) / this.globalConfig.lifeTime;
            return {
                position: [-barrageWidth, top],
                speed: [speedX, 0],
                rangeWidth: [-barrageWidth, this.containerWidth + barrageWidth]
            };
        }
        // scroll
        const speedX = -(this.containerWidth + barrageWidth) / this.globalConfig.lifeTime;
        return {
            position: [this.containerWidth, top],
            speed: [speedX, 0],
            rangeWidth: [-barrageWidth, this.containerWidth],
        };
    }
    add(sprite) {
        sprite.id = createId('sprite-');
        this.queue.push(sprite);
    }
    addSprite(sprite, top) {
        sprite.setAnimation(this.calcAnimation(sprite.rect, top));
        this.sprites[sprite.id] = sprite;
    }
    calcEmployTrack(height) {
        const employ = Object.values(this.employTrack);
        const employTrackPosition = getCanUseTrack(employ, this.trackTop, height);
        if (employTrackPosition) {
            return employTrackPosition;
        }
        return null;
    }
    calcPosition() {
        if (this.queue.length === 0) {
            return;
        }
        const [sprite] = this.queue;
        const [, height] = sprite.rect;
        const employTrackPosition = this.calcEmployTrack(height);
        if (employTrackPosition) {
            this.employTrack[sprite.id] = employTrackPosition.toString();
            sprite.employTrack = true;
            this.addSprite(sprite, employTrackPosition[0]);
            this.queue.shift();
        }
    }
    start() {
        this.status = true;
    }
    stop() {
        this.timer = null;
        this.status = false;
    }
    clear() {
        this.sprites = {};
    }
    run() {
        if (!Scene.status) {
            return;
        }
        this.calcPosition();
        this.render();
        const run = this.run.bind(this);
        this.timer = window.requestAnimationFrame(run);
    }
    resize() {
        this.containerWidth = this.container.offsetWidth;
        this.containerHeight = this.container.offsetHeight;
    }
    initCanvas(container) {
        const { offsetWidth, offsetHeight } = container;
        this.container = container;
        this.containerWidth = offsetWidth;
        this.containerHeight = offsetHeight;
        const canvas = createCanvas('canvas-huiyidun', offsetWidth, offsetHeight);
        canvas.style.position = 'absolute';
        canvas.style.display = 'block';
        this.container.append(canvas);
        this.ctx = canvas.getContext('2d');
        this.trackTop = [screenSpace, this.containerHeight - screenSpace];
    }
    render() {
        this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
        Object.keys(this.sprites).forEach(uid => {
            const sprite = this.sprites[uid];
            sprite.animation({
                type: this.globalConfig.type,
                containerWidth: this.containerWidth,
            });
            if (!sprite.employTrack && this.employTrack[sprite.id]) {
                delete this.employTrack[sprite.id];
            }
            if (!sprite.status) {
                delete this.sprites[uid];
            }
            else {
                sprite.render(this.ctx);
            }
        });
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class Sprite {
    constructor(spriteArgs, globalConfig) {
        this.status = true;
        this.speed = [1, 1];
        this.position = null;
        // 占用起飞跑道标志
        this.employTrack = false;
        const { avatar, fontFamily, fontColor, fontSize, avatarSize, content, padding, radius, } = mixConfig(spriteArgs, defaultSpriteConfig);
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
        this.size = this.calcRect(globalConfig.ctx);
        const canvas = document.createElement('canvas');
        canvas.width = this.size[0];
        canvas.height = this.size[1];
        this.templateCanvas = canvas;
        this.getImageData();
    }
    set avatarStatus(status) {
        if (status) {
            this.getImageData();
        }
    }
    getImageData() {
        this.templateCtx = this.templateCanvas.getContext('2d');
        this.templateCtx.clearRect(0, 0, this.size[0], this.size[1]);
        this.draw(this.templateCtx);
    }
    render(ctx) {
        ctx.drawImage(this.templateCanvas, ...this.position);
    }
    loadingImage(avatar) {
        (() => __awaiter(this, void 0, void 0, function* () {
            if (avatar) {
                // 头像
                this.avatar = (yield loadingImage(avatar)) || null;
                this.avatarStatus = true;
            }
        }))();
    }
    // 计算尺寸
    calcRect(ctx) {
        const [paddingTop, paddingRight, paddingBottom, paddingLeft] = this.style.padding;
        ctx.save();
        ctx.font = `${this.font.fontSize}px ${this.font.fontFamily}`;
        const measureText = ctx.measureText(this.content);
        ctx.restore();
        const barrageAllWidth = (this.style.avatarSize + imageAndTextSpace + measureText.width +
            paddingLeft + paddingRight);
        const barrageAllHeight = (Math.max(this.style.avatarSize, this.font.fontSize) +
            paddingTop + paddingBottom);
        return [Math.floor(barrageAllWidth), barrageAllHeight];
    }
    // 设置关于运动的参数
    setAnimation({ position, speed, rangeWidth }) {
        this.position = position;
        this.speed = speed;
        this.rangeWidth = rangeWidth;
    }
    draw(ctx) {
        const [, , left] = this.style.padding;
        // 头像
        const avatarSpaceTop = (this.size[1] - this.style.avatarSize) / 2;
        if (this.avatar && typeof this.avatar !== 'string') {
            Sprite.drawAvatar(ctx, {
                img: this.avatar,
                position: [left, avatarSpaceTop],
                imageHeight: this.style.avatarSize,
                imageWidth: this.style.avatarSize,
                radius: this.style.radius,
            });
        }
        const textSpaceTop = (this.size[1] - this.font.fontSize - 5) / 2;
        this.drawText(ctx, {
            left: this.style.avatarSize + imageAndTextSpace + left,
            top: textSpaceTop
        });
        this.drawBorder(ctx);
    }
    static checkEmployTrack({ left, width, type, containerWidth }) {
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
        return true;
    }
    animation({ type, containerWidth }) {
        if (!this.position) {
            return;
        }
        const left = this.position[0] + this.speed[0];
        const top = this.position[1] + this.speed[1];
        const offsetWidth = (this.rangeWidth &&
            (this.rangeWidth[0] > left ||
                this.rangeWidth[1] < left));
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
                width: this.size[0],
            });
        }
    }
    remove() {
        this.status = false;
    }
    drawBorder(ctx, pos = {}) {
        const { left = 0, top = 0 } = pos;
        const [barrageAllWidth, barrageAllHeight] = this.size;
        //x轴方向的阴影偏移量,负数为向右偏移量
        ctx.shadowOffsetX = 3;
        //y轴方向的阴影偏移量,负数为向上偏移量
        ctx.shadowOffsetY = 3;
        //阴影模糊强度
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(46, 141, 239, 0.4)";
        ctx.strokeStyle = 'rgba(46, 141, 239, 1)';
        ctx.strokeRect(left, top, barrageAllWidth, barrageAllHeight);
    }
    drawText(ctx, { left = 0, top = 0 }) {
        ctx.fillStyle = this.font.fontColor;
        ctx.font = `${this.font.fontSize}px ${this.font.fontFamily}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(this.content, left, top);
    }
    static drawAvatar(ctx, roundImageArgs) {
        const { img, imageWidth, imageHeight, position, } = roundImageArgs;
        let { radius } = roundImageArgs;
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
            const { width, height } = img;
            ctx.drawImage(img, 0, 0, width, height, x, y, imageWidth, imageHeight);
        }
        ctx.restore();
    }
    ;
}

class Barrage {
    constructor(container, globalConfig = {}) {
        this.globalConfig = mixConfig(globalConfig, defaultGlobalConfig);
        // 创建场景
        this.scene = new Scene(container, this.globalConfig);
        this.stop = this.scene.stop.bind(this.scene);
        this.start = this.scene.start.bind(this.scene);
        this.clear = this.scene.clear.bind(this.scene);
    }
    add({ content, avatar }) {
        this.scene.add(new Sprite({
            avatar, content
        }, {
            ctx: this.scene.ctx,
        }));
    }
}

module.exports = Barrage;
