'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var three = require('three');
var axios = _interopDefault(require('axios'));

const employTrackSpaceY = 20;
class TrackManager {
    constructor(globalConfig) {
        // 占用的轨道
        this.employTrack = {};
        this.globalConfig = globalConfig;
    }
    getCanUseTrack(employTrack, allTrack, height) {
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
    // 申请轨道
    applyPosition(sprite) {
        const employ = Object.values(this.employTrack);
        const [, height] = sprite.size;
        const employTrackPosition = this.getCanUseTrack(employ, this.globalConfig.trackRange, height);
        if (!employTrackPosition) {
            return null;
        }
        this.employTrack[sprite.id] = employTrackPosition.toString();
        sprite.employTrack = true;
        return employTrackPosition[0];
    }
    // 删除占用轨道
    removeEmployWithNotEmploy(sprite) {
        if (!sprite.employTrack && this.employTrack[sprite.id]) {
            delete this.employTrack[sprite.id];
        }
    }
}

class Scene {
    constructor(globalConfig) {
        this.timer = null;
        // 精灵实例map
        this.spriteInstances = {};
        // 需要加入的精灵
        this.needAddSpriteList = [];
        this.run = () => {
            this.tryToAddSprite();
            this.render();
            this.timer = window.requestAnimationFrame(this.run);
        };
        this.globalConfig = globalConfig;
        this.trackManger = new TrackManager(globalConfig);
        this.start();
    }
    calcAnimation(rect, top = 12) {
        const [barrageWidth] = rect;
        if (this.globalConfig.type === 'reversescroll') {
            const speedX = (this.globalConfig.containerWidth + barrageWidth) / this.globalConfig.lifeTime;
            return {
                position: [-barrageWidth, top],
                speed: [speedX, 0],
                rangeWidth: [-barrageWidth, this.globalConfig.containerWidth + barrageWidth]
            };
        }
        // scroll
        const speedX = -(this.globalConfig.containerWidth + barrageWidth) / this.globalConfig.lifeTime;
        return {
            position: [this.globalConfig.containerWidth, top],
            speed: [speedX, 0],
            rangeWidth: [-barrageWidth, this.globalConfig.containerWidth],
        };
    }
    add(sprite) {
        this.needAddSpriteList.push(sprite);
    }
    addSprite(sprite, top) {
        sprite.setAnimation(this.calcAnimation(sprite.size, top));
        this.spriteInstances[sprite.id] = sprite;
    }
    tryToAddSprite() {
        if (this.needAddSpriteList.length === 0) {
            return;
        }
        const [sprite] = this.needAddSpriteList;
        const top = this.trackManger.applyPosition(sprite);
        if (top) {
            this.addSprite(sprite, top);
            this.needAddSpriteList.shift();
        }
    }
    resetGlobalConfig(globalConfig) {
        this.globalConfig = Object.assign(Object.assign({}, this.globalConfig), globalConfig);
    }
    start() {
        if (!this.timer) {
            this.run();
        }
    }
    stop() {
        if (this.timer) {
            window.cancelAnimationFrame(this.timer);
            this.timer = null;
        }
    }
    clear() {
        this.spriteInstances = {};
    }
    destroy() {
        this.stop();
        this.clear();
    }
    drawTemplateCanvas() {
        this.globalConfig.templateCtx.clearRect(0, 0, this.globalConfig.containerWidth, this.globalConfig.containerHeight);
        Object.keys(this.spriteInstances).forEach(uid => {
            try {
                const sprite = this.spriteInstances[uid];
                sprite.animation();
                this.trackManger.removeEmployWithNotEmploy(sprite);
                if (!sprite.status) {
                    delete this.spriteInstances[uid];
                }
                else {
                    sprite.render(this.globalConfig.templateCtx);
                }
            }
            catch (e) {
            }
        });
    }
    render() {
        this.drawTemplateCanvas();
        this.globalConfig.ctx.clearRect(0, 0, this.globalConfig.containerWidth, this.globalConfig.containerHeight);
        this.globalConfig.ctx.drawImage(this.globalConfig.templateCanvas, 0, 0);
    }
}

const cacheImages = {};
function loadImage(src, onload, onError) {
    if (cacheImages[src]) {
        onload(cacheImages[src]);
        return;
    }
    const image = new Image();
    image.crossOrigin = '';
    image.src = src;
    image.onload = () => {
        cacheImages[src] = image;
        onload(cacheImages[src]);
    };
    image.onerror = onError || function () {
    };
}

const imageAndTextSpace = 12;
class DrawManager {
    constructor(spriteConfig, globalConfig) {
        this.globalConfig = globalConfig;
        this.spriteConfig = spriteConfig;
    }
    calcSize() {
        const [paddingTop, paddingRight, paddingBottom, paddingLeft] = this.spriteConfig.padding;
        this.globalConfig.ctx.save();
        this.globalConfig.ctx.font = `${this.spriteConfig.fontSize}px ${this.spriteConfig.fontFamily}`;
        const measureText = this.globalConfig.ctx.measureText(this.spriteConfig.content);
        this.globalConfig.ctx.restore();
        const barrageAllWidth = (this.spriteConfig.avatarSize + imageAndTextSpace + measureText.width +
            paddingLeft + paddingRight);
        const barrageAllHeight = (Math.max(this.spriteConfig.avatarSize, this.spriteConfig.fontSize) +
            paddingTop + paddingBottom);
        return [Math.floor(barrageAllWidth), barrageAllHeight];
    }
    draw(ctx, options) {
        const [, , left] = this.spriteConfig.padding;
        // 头像
        const avatarSpaceTop = (options.size[1] - this.spriteConfig.avatarSize) / 2;
        if (options.avatarImage && typeof options.avatarImage !== 'string') {
            DrawManager.drawAvatar(ctx, {
                img: options.avatarImage,
                position: [left, avatarSpaceTop],
                imageHeight: this.spriteConfig.avatarSize,
                imageWidth: this.spriteConfig.avatarSize,
                radius: this.spriteConfig.radius,
            });
        }
        const textSpaceTop = (options.size[1] - this.spriteConfig.fontSize - 5) / 2;
        this.drawText(ctx, {
            left: this.spriteConfig.avatarSize + imageAndTextSpace + left,
            top: textSpaceTop
        });
        DrawManager.drawBorder(ctx, options);
    }
    static drawBorder(ctx, options) {
        const [barrageAllWidth, barrageAllHeight] = options.size;
        //x轴方向的阴影偏移量,负数为向右偏移量
        ctx.shadowOffsetX = 3;
        //y轴方向的阴影偏移量,负数为向上偏移量
        ctx.shadowOffsetY = 3;
        //阴影模糊强度
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(46, 141, 239, 0.4)";
        ctx.strokeStyle = 'rgba(46, 141, 239, 1)';
        ctx.strokeRect(0, 0, barrageAllWidth, barrageAllHeight);
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
    drawText(ctx, { left = 0, top = 0 }) {
        ctx.fillStyle = this.spriteConfig.fontColor;
        ctx.font = `${this.spriteConfig.fontSize}px ${this.spriteConfig.fontFamily}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(this.spriteConfig.content, left, top);
    }
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

const employTrackSpaceX = 20;
class Sprite {
    constructor(spriteConfig, globalConfig) {
        this.status = true;
        this.position = null;
        this.speed = [1, 1];
        // 占用起飞跑道标志
        this.employTrack = false;
        this.getImageData = () => {
            this.templateCtx = this.templateCanvas.getContext('2d');
            this.templateCtx.clearRect(0, 0, this.size[0], this.size[1]);
            this.drawManager.draw(this.templateCtx, {
                avatarImage: this.avatarImage,
                size: this.size
            });
        };
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
    render(ctx) {
        ctx.drawImage(this.templateCanvas, ...this.position);
    }
    // 设置关于运动的参数
    setAnimation({ position, speed, rangeWidth }) {
        this.position = position;
        this.speed = speed;
        this.rangeWidth = rangeWidth;
    }
    checkEmployTrack(left) {
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
        return true;
    }
    animation() {
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
            this.employTrack = this.checkEmployTrack(left);
        }
    }
    remove() {
        this.status = false;
    }
}

const getRandomColor = () => ('rgb(' + parseInt(String(Math.random() * 255)) + ','
    + parseInt(String(Math.random() * 255)) + ','
    + parseInt(String(Math.random() * 255)) + ')');
const mixConfig = (config, defaultConfig) => {
    Object.keys(defaultConfig).forEach(key => {
        if (typeof config[key] === 'undefined') {
            config[key] = defaultConfig[key];
        }
    });
    return config;
};

const screenSpace = 32;
const defaultGlobalConfig = {
    type: 'scroll',
    lifeTime: 200,
};
const defaultSpriteConfig = {
    fontSize: 36,
    fontFamily: 'Microsoft YaHei',
    avatarSize: 50,
    type: 'text',
    padding: [12, 12, 12, 12],
    radius: 20,
};
class Barrage {
    constructor(container, globalConfig = {}) {
        this.resize = () => {
            const globalConfig = this.calcData();
            const { containerHeight, containerWidth, } = globalConfig;
            this.globalConfig.canvas.width = containerWidth;
            this.globalConfig.canvas.height = containerHeight;
            this.globalConfig.templateCanvas.width = containerWidth;
            this.globalConfig.templateCanvas.height = containerHeight;
            this.scene.resetGlobalConfig(globalConfig);
        };
        this.globalConfig = mixConfig(globalConfig, defaultGlobalConfig);
        this.container = container;
        this.globalConfig.canvas = this.initCanvas(true);
        this.globalConfig.templateCanvas = this.initCanvas();
        this.globalConfig.templateCtx = this.globalConfig.templateCanvas.getContext('2d');
        this.globalConfig.ctx = this.globalConfig.canvas.getContext('2d');
        this.globalConfig = Object.assign(Object.assign({}, this.globalConfig), this.calcData());
        // 创建场景
        this.scene = new Scene(this.globalConfig);
        this.stop = this.scene.stop.bind(this.scene);
        this.start = this.scene.start.bind(this.scene);
        this.clear = this.scene.clear.bind(this.scene);
        window.addEventListener('resize', this.resize);
    }
    add(spriteConfig) {
        spriteConfig = mixConfig(spriteConfig, defaultSpriteConfig);
        if (!spriteConfig.fontColor) {
            spriteConfig.fontColor = getRandomColor();
        }
        this.scene.add(new Sprite(spriteConfig, this.globalConfig));
    }
    destroy() {
        this.scene.destroy();
        window.removeEventListener('resize', this.resize);
    }
    initCanvas(isTemplate = false) {
        const { offsetWidth, offsetHeight } = this.container;
        const canvas = createCanvas('canvas-huiyidun', offsetWidth, offsetHeight);
        if (isTemplate) {
            canvas.style.position = 'absolute';
            canvas.style.display = 'block';
            this.container.append(canvas);
        }
        return canvas;
    }
    calcData() {
        const { offsetWidth: containerWidth, offsetHeight: containerHeight, } = this.container;
        // 轨道Y轴返回
        const trackRange = [screenSpace, containerHeight - screenSpace];
        return {
            containerHeight,
            containerWidth,
            trackRange,
        };
    }
}

class CashManager {
    constructor(canvas, ctx, repaint) {
        // private currentIndex: number;
        this.cashList = [];
        this.canvas = canvas;
        this.ctx = ctx;
        this.repaint = repaint;
    }
    clear() {
        this.cashList = [];
    }
    undo() {
        if (!this.cashList || this.cashList.length === 0) {
            return;
        }
        // const cash = this.cashList[this.cashList.length - 1];
        // console.log(this.repaint, cash);
    }
    redo() {
        console.log(this.repaint, this.ctx);
    }
    addRecord() {
        this.cashList.push(this.canvas.toDataURL());
        // this.currentIndex = this.cashList.length - 1;
    }
}

const getPoint = (e) => {
    if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        return { x, y };
    }
    return {
        x: e.clientX,
        y: e.clientY,
    };
};

/**
 * todo list
 * - [ ] 回退，前进
 * - [ ] 同步多大尺寸
 * - [ ] 选择线粗细，颜色
 * - [ ] 保存图片
 * - [ ] 笔画更细腻
 * - [ ] 旋转
 */
class Draw {
    constructor(config) {
        this.type = 'draw';
        this.repaint = (image) => {
            this.clear();
            this.ctx.drawImage(image, 0, 0, this.containerWidth, this.containerHeight);
        };
        const { container, type = 'draw', lineWidth = 10, onSync, lineColor = '#fff', shadowBlur = 1, lineCap = 'round', lineJoin = 'round', } = config;
        this.containerWidth = container.offsetWidth;
        this.containerHeight = container.offsetHeight;
        this.type = type;
        this.lineWidth = lineWidth;
        this.onSync = onSync;
        this.canvas = this.initCanvas(container);
        this.ctx = this.canvas.getContext('2d');
        this.cashManager = new CashManager(this.canvas, this.ctx, this.repaint);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.shadowBlur = shadowBlur;
        this.ctx.shadowColor = lineColor;
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineCap = lineCap;
        this.ctx.lineJoin = lineJoin;
    }
    prepareDraw(canvas) {
        const start = e => {
            this.handle({
                type: 'start',
                point: getPoint(e),
            });
        };
        const end = this.handle.bind(this, { type: 'end' });
        const move = e => {
            this.handle({
                type: 'move',
                point: getPoint(e),
            });
        };
        // start
        canvas.addEventListener('touchstart', start);
        // move
        canvas.addEventListener('mousedown', e => {
            start(e);
            canvas.addEventListener('mousemove', move);
        });
        canvas.addEventListener('touchmove', move);
        // end
        canvas.addEventListener('touchend', end);
        const pcEnd = () => {
            canvas.removeEventListener('mousemove', move);
            end();
        };
        canvas.addEventListener('mouseup', pcEnd);
        // out
        canvas.addEventListener('mouseout', pcEnd);
    }
    initCanvas(container) {
        const canvas = createCanvas('draw', this.containerWidth, this.containerHeight);
        if (this.type === 'draw') {
            this.prepareDraw(canvas);
        }
        container.appendChild(canvas);
        return canvas;
    }
    action(action) {
        const { type } = action;
        if (type === 'setStyle') {
            const { styleAttr, styleValue } = action;
            if (styleAttr === 'lineColor') {
                this.ctx.shadowColor = styleValue.toString();
                this.ctx.strokeStyle = styleValue.toString();
                return;
            }
            if (styleAttr === 'lineWidth') {
                this.ctx[styleAttr] = styleValue;
                this.lineWidth = styleValue;
                return;
            }
            this.ctx[styleAttr] = styleValue;
            return;
        }
        if (type === 'start') {
            const { point } = action;
            this.ctx.beginPath();
            this.ctx.fill();
            this.ctx.moveTo(point.x - this.lineWidth / 16, point.y - this.lineWidth / 16);
            this.ctx.lineTo(point.x, point.y);
            this.ctx.stroke();
            return;
        }
        if (type === 'move') {
            const { point } = action;
            this.ctx.lineTo(point.x, point.y);
            this.ctx.stroke();
            return;
        }
        if (type === 'end') {
            this.ctx.closePath();
            return;
        }
        if (type === 'clear') {
            this.clear();
            return;
        }
        // 撤消（回到上一步）
        if (type === 'undo') {
            this.cashManager.undo();
        }
        // 重做（往前一步）
        if (type === 'redo') {
            this.cashManager.redo();
        }
    }
    clear() {
        this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
    }
    handle(action) {
        if (this.onSync) {
            this.onSync(action);
        }
        this.cashManager.addRecord();
        this.action(action);
    }
    getImage() {
        return this.canvas.toDataURL('image/png');
    }
}

class Sign3D {
    constructor(config) {
        this.render = () => {
            this.timer = window.requestAnimationFrame(this.render);
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
            this.renderer.render(this.scene, this.camera);
        };
        this.resize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.render(this.scene, this.camera);
        };
        this.config = config;
        this.prepareRender();
        this.add();
        this.render();
        window.addEventListener('resize', this.resize);
    }
    destroy() {
        if (this.timer) {
            window.cancelAnimationFrame(this.timer);
        }
        window.removeEventListener('resize', this.resize);
    }
    add() {
        const geometry = new three.BoxGeometry();
        const material = new three.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new three.Mesh(geometry, material);
        this.scene.add(this.cube);
    }
    prepareRender() {
        this.config.container.style.backgroundImage = `url(${this.config.backgroundImage})`;
        // 场景
        this.scene = new three.Scene();
        // 摄像机
        this.camera = new three.PerspectiveCamera(40, 
        // 窗口宽高比
        window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 30;
        // 渲染器
        this.renderer = new three.WebGLRenderer({ alpha: true });
        this.renderer.domElement.style.display = 'block';
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.config.container.appendChild(this.renderer.domElement);
    }
}

class Lottery3d {
}

var request = (globalConfig) => {
    const { baseUrl, getHeaders, handleRes } = globalConfig;
    axios.defaults.baseURL = baseUrl;
    return (url, data) => {
        return new Promise((resolve, reject) => {
            axios.post(url, data, {
                headers: getHeaders()
            }).then(res => {
                handleRes(res.data, resolve, reject);
            }).catch(e => {
                reject(e);
            });
        });
    };
};

exports.Barrage = Barrage;
exports.Draw = Draw;
exports.Lottery3d = Lottery3d;
exports.Sign3D = Sign3D;
exports.request = request;
