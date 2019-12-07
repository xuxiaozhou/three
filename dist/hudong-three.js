'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var TWEEN = _interopDefault(require('@tweenjs/tween.js'));
var threeText2d2 = require('three-text2d-2');
var _ = require('lodash');
var ___default = _interopDefault(_);
var three = require('three');

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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Base = /** @class */ (function () {
    function Base(config) {
        this.$users = [];
        this.avatarSize = 35;
        this.loaded = false;
        var dom = config.dom, callback = config.callback, _a = config.backgroundType, backgroundType = _a === void 0 ? '2D' : _a, backgroundImage = config.backgroundImage, _b = config.shape, shape = _b === void 0 ? 'Round' : _b;
        this.dom = dom;
        this.shape = shape;
        this.callback = callback;
        this.backgroundType = backgroundType;
        this.backgroundImage = backgroundImage;
        this.group = new three.Group();
        this.scene = new three.Scene();
    }
    Object.defineProperty(Base.prototype, "users", {
        /**
         * 设置参会人
         * @param users
         */
        set: function (users) {
            this.$users = users;
            if (!this.loaded && users.length !== 0) {
                this.callback('loading');
                this.init();
                this.loaded = true;
            }
            if (users.length === 0) {
                this.callback('not user');
            }
        },
        enumerable: true,
        configurable: true
    });
    Base.prototype.destroy = function () {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    };
    Base.prototype.initRender = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.backgroundType === '3D') ;
                else {
                    this.dom.style.backgroundImage = "url(" + this.backgroundImage + ")";
                }
                this.camera = new three.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 20, 10000);
                this.camera.position.z = 3000;
                this.renderer = new three.WebGLRenderer({ alpha: true });
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.domElement.style.position = 'fixed';
                this.renderer.domElement.style.left = '0px';
                this.dom.appendChild(this.renderer.domElement);
                return [2 /*return*/];
            });
        });
    };
    Base.clampToMaxSize = function (image, maxSize) {
        if (image.width > maxSize || image.height > maxSize) {
            var scale = maxSize / Math.max(image.width, image.height);
            // @ts-ignore
            var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            canvas.width = Math.floor(image.width * scale);
            canvas.height = Math.floor(image.height * scale);
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            return canvas;
        }
        return image;
    };
    Base.prototype.getTexture = function (url) {
        var _this = this;
        return new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var textTure;
            return __generator(this, function (_a) {
                // 第一种方式获取
                textTure = new three.TextureLoader().load(url, function (texture) {
                    textTure.image = Base.clampToMaxSize(texture.image, 128);
                    res(textTure);
                }, function () {
                }, function () {
                    console.log('图片【' + url + '】下载错误');
                    res(textTure);
                });
                return [2 /*return*/];
            });
        }); });
    };
    return Base;
}());

var Artascope = /** @class */ (function () {
    function Artascope(options) {
        this.rotationSpeed = options.rotationSpeed;
        this.group = options.group;
        this.camera = options.camera;
        var vector = new three.Vector3();
        var objs = [];
        var radius = 200;
        var everyNum = 25;
        for (var i = 0; i < options.counter; i++) {
            var e = parseInt(String(i / everyNum), 10);
            var phi = Math.PI * (2 / everyNum) * (i % everyNum);
            var object = new three.Object3D();
            object.position.x = radius * Math.sin(phi);
            object.position.y = radius * Math.cos(phi);
            object.position.z = -e * 100 + 2800;
            vector.x = object.position.x * 2;
            vector.y = object.position.y * 2;
            vector.z = object.position.z;
            object.lookAt(vector);
            objs.push(object);
        }
        this.objs = objs;
    }
    Artascope.prototype.tween = function (TWEEN) {
        var _a = this, rotationSpeed = _a.rotationSpeed, group = _a.group, camera = _a.camera;
        new TWEEN.Tween(camera.position)
            .easing(TWEEN.Easing.Quartic.InOut)
            .onUpdate(function () {
            group.rotation.z -= 0.001 * rotationSpeed;
        })
            .to({ z: 500 }, 10000)
            .yoyo(true)
            .repeat(Infinity)
            .start();
    };
    return Artascope;
}());

var Grid = /** @class */ (function () {
    function Grid(options) {
        this.group = options.group;
        this.camera = options.camera;
        var objs = [];
        for (var i = 0; i < options.counter; i += 1) {
            var object = new three.Object3D();
            var offset = 180;
            var colmn = 8;
            object.position.x = ((i % colmn) * offset) - (offset * (colmn - 1)) / 2;
            object.position.y = (-(Math.floor(i / colmn) % colmn) * offset) + (offset * (colmn - 1)) / 2;
            object.position.z = (Math.floor(i / (colmn * colmn))) * 600 - 4000;
            objs.push(object);
        }
        this.objs = objs;
    }
    Grid.prototype.tween = function (TWEEN) {
        var Time = 5000;
        var _a = this, camera = _a.camera, group = _a.group;
        var rand = function () {
            //生成从minNum到maxNum的随机数
            function randomNum(minNum, maxNum) {
                switch (arguments.length) {
                    case 1:
                        return parseInt(String(Math.random() * minNum + 1), 10);
                    case 2:
                        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                    default:
                        return 0;
                }
            }
            // 随机位置的最大值
            var raio = 3000;
            var height = 250;
            return {
                z: randomNum(500, raio),
                x: randomNum(-height, height),
                y: randomNum(-height, height)
            };
        };
        var tween = function () {
            new TWEEN.Tween(camera.position)
                .onComplete(tween)
                .easing(TWEEN.Easing.Back.InOut)
                .onUpdate(function () {
                camera.lookAt(__assign({}, group.position));
            })
                .to(rand(), Time)
                .start();
        };
        tween();
    };
    return Grid;
}());

var Logo = /** @class */ (function () {
    function Logo(options) {
        var tableData = options.tableData;
        this.group = options.group;
        this.camera = options.camera;
        var objs = [];
        for (var i = 0; i < tableData.length; i++) {
            var object = new three.Object3D();
            var itemWidth = 35;
            // 增加向上，减少向下
            object.position.y = -(tableData[i][1] * itemWidth) + itemWidth * 32 / 2;
            // 减小向右，增加向左
            object.position.x = tableData[i][0] * itemWidth - itemWidth * 64 / 2;
            objs.push(object);
        }
        this.objs = objs;
    }
    Logo.prototype.tween = function (TWEEN) {
        var _a = this, camera = _a.camera, group = _a.group;
        var Time = 3000;
        var PositionUpdate = function (num) {
            num = num / 100;
            camera.position.y = num * 100;
            camera.position.x = num * 300;
            camera.lookAt(group.position);
        };
        var tween = new TWEEN.Tween({ Value: 0 })
            .to({ Value: 100 }, Time / 2)
            .easing(TWEEN.Easing.Back.InOut)
            .onUpdate(function (data) {
            PositionUpdate(data.Value);
            camera.position.z = 3000 - (3000 - 2500) * data.Value / 100;
        });
        var rotationTween = new TWEEN.Tween({ Value: 100 })
            .to({ Value: -100 }, Time)
            .easing(TWEEN.Easing.Back.InOut)
            .onUpdate(function (data) {
            PositionUpdate(data.Value);
        })
            .yoyo(true)
            .repeat(Infinity);
        tween.chain(rotationTween);
        tween.start();
        new TWEEN.Tween({ sunShine: 60 })
            .to({ sunShine: 100 }, Time / 2)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(function () {
            // let sunShine = data.sunShine / 100
            // this.GodRaysPass.godRaysMaterial.uniforms.density.value = sunShine
            // this.GodRaysPass.intensity = sunShine
        })
            .yoyo(true)
            .repeat(Infinity)
            .start();
    };
    return Logo;
}());

var Helix = /** @class */ (function () {
    function Helix(options) {
        var vector = new three.Vector3();
        this.group = options.group;
        this.camera = options.camera;
        this.rotationSpeed = options.rotationSpeed;
        var objs = [];
        for (var i = 0; i < options.counter; i++) {
            var phi = i * 0.155 + Math.PI;
            var object = new three.Object3D();
            var radius = 500;
            object.position.x = radius * Math.sin(phi);
            object.position.y = -(i * 3) + radius / 2;
            object.position.z = radius * Math.cos(phi);
            vector.x = object.position.x * 2;
            vector.y = object.position.y;
            vector.z = object.position.z * 2;
            object.lookAt(vector);
            objs.push(object);
        }
        this.objs = objs;
    }
    Helix.prototype.tween = function (TWEEN) {
        var Time = 5000;
        var _a = this, camera = _a.camera, group = _a.group, rotationSpeed = _a.rotationSpeed;
        var rand = function () {
            //生成从minNum到maxNum的随机数
            function randomNum(minNum, maxNum) {
                switch (arguments.length) {
                    case 1:
                        return parseInt(String(Math.random() * minNum + 1), 10);
                    case 2:
                        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                    default:
                        return 0;
                }
            }
            // 随机位置的最大值
            var radio = 1500;
            return {
                z: randomNum(-radio, radio),
                x: randomNum(-radio, radio),
            };
        };
        var tween = function () {
            new TWEEN.Tween(camera.position)
                .onComplete(tween)
                .easing(TWEEN.Easing.Back.InOut)
                .onUpdate(function () {
                camera.lookAt(__assign(__assign({}, group.position), { y: 0 }));
            })
                .to(rand(), Time)
                .start();
        };
        new TWEEN.Tween(group.position)
            .onUpdate(function () {
            group.rotation.y -= 0.001 * rotationSpeed;
        })
            .to({ y: 2000 }, Time * 10)
            .yoyo(true)
            .repeat(Infinity)
            .delay(1000)
            .start();
        tween();
    };
    return Helix;
}());

var Sphere = /** @class */ (function () {
    function Sphere(options) {
        this.lon = 90;
        this.lon = 90;
        this.group = options.group;
        this.camera = options.camera;
        var vector = new three.Vector3();
        var objs = [];
        for (var i = 0, length = options.counter; i < length; i++) {
            var phi = Math.acos(-1 + (2 * i) / length);
            var theta = Math.sqrt(length * Math.PI) * phi;
            var object = new three.Object3D();
            var radius = 850;
            if (options.counter > 100) {
                radius = Math.sqrt(options.counter * 7230);
                // this.scale = 850 / radius < 1 ? 850 / radius : 1
            }
            object.position.x = radius * Math.cos(theta) * Math.sin(phi);
            object.position.y = radius * Math.sin(theta) * Math.sin(phi);
            object.position.z = radius * Math.cos(phi);
            // console.log(object.scale)
            vector.copy(object.position).multiplyScalar(2);
            object.lookAt(vector);
            objs.push(object);
        }
        this.objs = objs;
    }
    Sphere.prototype.tween = function () {
        var Time = 5000;
        var rotationSpeed = 0.2; // 旋转速度
        var _a = this, camera = _a.camera, group = _a.group;
        var rand = function () {
            //生成从minNum到maxNum的随机数
            function randomNum(minNum, maxNum) {
                switch (arguments.length) {
                    case 1:
                        return parseInt(String(Math.random() * minNum + 1), 10);
                    case 2:
                        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                    default:
                        return 0;
                }
            }
            // 随机位置的最大值
            var raio = 1500;
            return {
                z: randomNum(-raio, raio),
                x: randomNum(-raio, raio),
                y: randomNum(-raio, raio)
            };
        };
        var tween = function () {
            new TWEEN.Tween(camera.position)
                .onComplete(tween)
                .easing(TWEEN.Easing.Back.InOut)
                .onUpdate(function () {
                group.rotation.y -= 0.001 * rotationSpeed;
                camera.lookAt(group.position);
            })
                .to(rand(), Time)
                .start();
        };
        tween();
    };
    /**
     * 球体自转
     * @param speed
     */
    Sphere.prototype.rotation = function (speed) {
        if (speed === void 0) { speed = 0.2; }
        var group = this.group;
        new TWEEN.Tween({ val: 0 })
            .onUpdate(function () {
            group.rotation.y += 0.001 * speed;
        })
            .to({ val: 100 }, 5000)
            .yoyo(true)
            .repeat(Infinity)
            .start();
    };
    /**
     * 摄像机旋转
     */
    Sphere.prototype.cameraRotation = function (speed) {
        var _this = this;
        if (speed === void 0) { speed = 0.5; }
        if (!this.lon) {
            this.lon = 90;
        }
        var camera = this.camera;
        var length = camera.position.length();
        var group = this.group;
        new TWEEN.Tween({ val: 0 })
            .onUpdate(function () {
            _this.lon += 0.1 * speed;
            var theta = three.Math.degToRad(_this.lon);
            camera.position.x = length * Math.cos(theta);
            camera.position.z = length * Math.sin(theta);
            camera.lookAt(group.position);
        })
            .to({ val: 100 }, 5000)
            .yoyo(true)
            .repeat(Infinity)
            .start();
    };
    return Sphere;
}());



var animatesEffect = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Artascope: Artascope,
    Grid: Grid,
    Logo: Logo,
    Helix: Helix,
    Sphere: Sphere
});

var colors = ['#f06292', '#9575cd', '#ef5350', '#4fc3f7', '#4dd0e1', '#66bb6a', '#fbc02d', '#ff7043'];
var defaultShowOptions = [
    {
        type: 'variate',
        value: 'name'
    },
    {
        type: 'variate',
        value: 'avatar'
    }
];
var Lottery3d = /** @class */ (function (_super) {
    __extends(Lottery3d, _super);
    // private ready: boolean;
    // private enableInit: boolean;
    // private RotationSpeed: { x: number; y: number; z: number };
    function Lottery3d(config) {
        var _this = _super.call(this, config) || this;
        _this.counter = 100;
        _this.turnSelectData = {};
        _this.showOption = config.showOption || defaultShowOptions;
        return _this;
    }
    Lottery3d.prototype.stop = function () {
    };
    // public start() {
    //   return new Promise(async resolve => {
    //     if (this.ready !== true) {
    //       this.callback('not ready');
    //       // reject('动画尚未准备就绪，请稍后')
    //       return
    //     }
    //     let group = this.group
    //     // let shineGroup = this.shineGroup
    //
    //     try {
    //       await this.LotteryInit()
    //       TWEEN.removeAll()
    //     } catch (e) {
    //       return
    //     }
    //
    //     // this.scene2.add(group)
    //
    //     let max = 3000
    //     this.RotationSpeed = {
    //       x: _.random(0, max),
    //       y: _.random(0, max),
    //       z: _.random(0, max)
    //     }
    //
    //     this.ready = false
    //     this.callback('lottery starting')
    //     // this.Vue.lotteryStatus = 'starting'
    //
    //     let Complete = async () => {
    //       this.ready = false
    //       // let objs = this.shineGroup.children
    //
    //       let users = []
    //       this.callback('lottery awarding')
    //       // this.Vue.lotteryStatus = 'awarding'
    //       // this.Vue.showzjList = true
    //
    //       let that = this
    //       let pushShowUser = function () {
    //         for (let obj of objs) {
    //           that.Vue.showOne(obj._uInfo)
    //           users.push(obj._uInfo)
    //         }
    //       }
    //
    //       if (!!this.Vue.roundConfig.isPaichu) {
    //         // 中奖排除时的动作
    //         if (objs.length <= 20)
    //         // 完成每个头像挨个移除的动效
    //           await (() => {
    //             return new Promise(async resolve => {
    //               let f
    //               for (let obj of objs) {
    //                 await (() => {
    //                   return new Promise(R => {
    //                     setTimeout(() => {
    //                       f = this.remove(obj).then(res => {
    //                         this.Vue.showOne(obj._uInfo)
    //                       })
    //                       R()
    //                     }, 200)
    //                   })
    //                 })()
    //                 users.push(obj._uInfo)
    //               }
    //               // 最后一个remove结束之后执行
    //               f.then(res => {
    //                 resolve(res)
    //               })
    //             })
    //           })()
    //         else
    //         // 数量超过20个直接删除消失
    //           pushShowUser()
    //
    //         this.shineGroup.remove(...objs)
    //       } else {
    //         pushShowUser()
    //         this.group.add(...objs)
    //       }
    //
    //       this.lotteryAfter()
    //
    //       resolve(users)
    //     }
    //
    //     new TWEEN.Tween()
    //       .onUpdate(data => {
    //         // 是否是停止阶段
    //         // this.Vue.lotteryStatus === 'slowdown' && (
    //         // this.slowDown()
    //         // )
    //
    //         let speed = this.RotationSpeed
    //         let isEmpty = true
    //         for (let index in speed) {
    //           let item = speed[index] * 0.0001
    //           item = item > 0 ? item : 0
    //           group.rotation[index] += item
    //           // 判断当前速度是否还有效
    //           item > 0 && (isEmpty = false)
    //         }
    //
    //         // 恢复原来的状态
    //         let shineChildren = shineGroup.children
    //         shineChildren.length > 0 && group.add(...shineChildren)
    //         shineGroup.remove(...shineChildren)
    //         let paixuObj = this.getNearstObj(n)
    //
    //         shineGroup.add(...paixuObj)
    //
    //         // 判断是否速度都为0 结束游戏
    //         if (isEmpty) {
    //           TWEEN.removeAll()
    //           Complete()
    //         }
    //       })
    //       .repeat(Infinity)
    //       .start()
    //   })
    // }
    // private CaculatePosition(length) {
    //   let Position = this.camera.position.clone()
    //   return Position.setLength(length)
    // }
    // private LotteryInit() {
    //   return new Promise(resolve => {
    //     if (this.enableInit) {
    //       this.callback('lotterying')
    //       // reject('正在准备抽奖阶段')
    //       return
    //     }
    //     this.enableInit = true
    //     // let group = this.group
    //     // group.add(this.shineGroup)
    //     // this.GodRaysPass.renderPassMask = this.ShineGroupMask
    //     // this.toneMappingPass.enabled = true
    //
    //     TWEEN.removeAll()
    //
    //     new TWEEN.Tween(this.camera.position)
    //       .easing(TWEEN.Easing.Cubic.Out)
    //       .to(this.CaculatePosition(3500), 500)
    //       .onUpdate(() => {
    //         this.camera.lookAt(this.group.position)
    //       })
    //       .onComplete(() => {
    //         this.enableInit = false
    //         resolve()
    //       })
    //       .start()
    //   })
    //
    // }
    Lottery3d.prototype.transform = function (target, duration) {
        var _this = this;
        return new Promise(function (resolve) {
            try {
                var targets = target.objs;
                TWEEN.removeAll();
                // this.ready = false;
                target.scale && _this.group.scale.set(target.scale, target.scale, target.scale);
                var objarr = _this.group.children;
                for (var i = 0; i < objarr.length; i++) {
                    var object = objarr[i];
                    var target_1 = targets[i];
                    if (typeof (target_1) == 'undefined') {
                        continue;
                    }
                    new TWEEN.Tween(object.position)
                        .to({
                        x: target_1.position.x,
                        y: target_1.position.y,
                        z: target_1.position.z
                    }, Math.random() * duration + duration)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start();
                    new TWEEN.Tween(object.rotation)
                        .to({
                        x: target_1.rotation.x,
                        y: target_1.rotation.y,
                        z: target_1.rotation.z
                    }, Math.random() * duration + duration)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start();
                }
                setTimeout(function () {
                    target.cameraRotation && target.cameraRotation();
                    // this.ready = true;
                    resolve();
                }, duration * 2);
            }
            catch (e) {
                console.log(e);
            }
        });
    };
    Lottery3d.turnSelect = function (uInfo, options) {
        var image = false;
        var out = '';
        var sexTurn = function (v) {
            if (v === 1)
                return '男';
            if (v === 2)
                return '女';
            return '未知';
        };
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var item = options_1[_i];
            // 文本
            if (item.type === 'text') {
                out += item.value;
            }
            // 变量
            if (item.type === 'variate') {
                var value = _.get(uInfo, item.value);
                if (item.value === 'sex') {
                    value = sexTurn(value);
                }
                if (item.value === 'avatar') {
                    if (!image) {
                        image = value;
                    }
                    value = '';
                }
                if (typeof value === 'undefined') {
                    value = '';
                }
                out += value;
            }
        }
        return {
            text: out || '未公开昵称',
            image: image
        };
    };
    Lottery3d.prototype.turnOutPut = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, image, text, texturn, e_1, $return;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.turnSelectData[user.openid]) {
                            return [2 /*return*/, this.turnSelectData[user.openid]];
                        }
                        _a = Lottery3d.turnSelect(user, this.showOption), image = _a.image, text = _a.text;
                        if (text === '未公开昵称') {
                            text = '';
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!(image !== false)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getTexture(image)];
                    case 2:
                        texturn = _b.sent();
                        image = texturn.image;
                        _b.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        image = false;
                        return [3 /*break*/, 5];
                    case 5:
                        $return = { text: text, image: image };
                        this.turnSelectData[user.openid] = $return;
                        return [2 /*return*/, $return];
                }
            });
        });
    };
    Lottery3d.prototype.createMesh = function (user, position) {
        if (position === void 0) { position = false; }
        return __awaiter(this, void 0, void 0, function () {
            var mesh, output, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        mesh = void 0;
                        if (!(user === false)) return [3 /*break*/, 1];
                        mesh = new threeText2d2.MeshText2D('暂无', {
                            font: '40px PingFang-SC',
                            fillStyle: '#ffffff',
                            antialias: true
                        });
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.turnOutPut(user)];
                    case 2:
                        output = _a.sent();
                        mesh = new threeText2d2.MeshText2D(output.text.slice(0, 10), {
                            canvas: output.image,
                            font: '40px PingFang-SC',
                            fillStyle: '#ffffff',
                            bgColor: _.sample(colors),
                            antialias: true
                        });
                        _a.label = 3;
                    case 3:
                        mesh.material.alphaTest = 0.1;
                        mesh.frustumCulled = true;
                        if (position === false) {
                            mesh.position.x = Math.random() * 4000 - 2000;
                            mesh.position.y = Math.random() * 4000 - 2000;
                            mesh.position.z = Math.random() * 4000 - 2000;
                        }
                        else {
                            mesh.position.x = position.x;
                            mesh.position.y = position.y;
                            mesh.position.z = position.z;
                        }
                        return [2 /*return*/, mesh];
                    case 4:
                        e_2 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Lottery3d.prototype.createMeshs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var num, i, user, object;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        num = this.$users.length < this.counter ? this.counter : this.$users.length;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < num)) return [3 /*break*/, 4];
                        user = this.$users[i] || false;
                        return [4 /*yield*/, this.createMesh(user)];
                    case 2:
                        object = _a.sent();
                        this.group.add(object);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Lottery3d.prototype.render = function () {
        this.animationFrame = requestAnimationFrame(this.render.bind(this));
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
    };
    Lottery3d.prototype.onResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
    };
    Lottery3d.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.initRender();
                        return [4 /*yield*/, this.createMeshs()];
                    case 1:
                        _a.sent();
                        this.scene.add(this.group);
                        this.transform(new Sphere({
                            counter: this.counter,
                            group: this.group,
                            camera: this.camera
                        }), 2000);
                        this.render();
                        window.addEventListener('resize', this.onResize.bind(this), false);
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.log(e_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Lottery3d;
}(Base));

var Fadeout = /** @class */ (function () {
    function Fadeout(options) {
        var objs = [];
        for (var i = 0; i < options.counter; i += 1) {
            var object = new three.Object3D();
            object.position.z = 30000;
            objs.push(object);
        }
        options.camera.position.set(0, 0, 3000);
        options.camera.lookAt(options.group.position);
        this.objs = objs;
    }
    return Fadeout;
}());

var TWEEN2 = new TWEEN.Group();
var Sign3D = /** @class */ (function (_super) {
    __extends(Sign3D, _super);
    function Sign3D(config) {
        var _this = _super.call(this, config) || this;
        _this.objects = [];
        _this.counter = 1000;
        var _a = config.animateSpendTime, animateSpendTime = _a === void 0 ? 10 : _a, openAnimates = config.openAnimates;
        _this.openAnimates = openAnimates;
        _this.animateSpendTime = animateSpendTime;
        _this.addUser = _this.addUser.bind(_this);
        return _this;
    }
    /**
     * 新增参会人
     * @param user
     */
    Sign3D.prototype.addUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            /**
             * 让object跟随相机移动
             * */
            function followCamera(data) {
                // 根据相机朝向 算出物品所在的相对位置
                var relative = CaculatePosition(camera, length);
                for (var index in porperty) {
                    for (var type in porperty[index]) {
                        if (index === 'rotation') {
                            object[index][type] = (camera[index][type] - porperty[index][type]) * data.value / 100 + porperty[index][type];
                        }
                        if (index === 'position') {
                            object[index][type] = (relative[type] + randNum[type] - porperty[index][type]) * data.value / 100 + porperty[index][type];
                        }
                    }
                }
            }
            /**
             * 初始化porperty 便于下次动画计算初始值与结束值
             */
            function initPorperty(world) {
                if (world === void 0) { world = false; }
                var position = world ? object.getWorldPosition() : object.position;
                var rotation = world ? object.getWorldRotation() : object.rotation;
                porperty = {
                    position: {
                        x: position.x,
                        y: position.y,
                        z: position.z
                    },
                    rotation: {
                        x: rotation.x,
                        y: rotation.y,
                        z: rotation.z
                    }
                };
            }
            var camera, object, replaceIndex, replaceObj, porperty, length, randNum, CaculatePosition, moveTo, wait, showing;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$users.push(user);
                        if (!this.scene) {
                            return [2 /*return*/];
                        }
                        camera = this.camera;
                        return [4 /*yield*/, this.createMesh(user)];
                    case 1:
                        object = _a.sent();
                        this.scene.add(object);
                        replaceIndex = _.random(0, this.nowAnimate.objs.length - 1);
                        replaceObj = this.objects[replaceIndex];
                        porperty = {};
                        length = 200;
                        randNum = {
                            x: three.Math.randInt(-50, 50),
                            y: three.Math.randInt(-30, 30),
                            z: three.Math.randInt(-50, 50),
                        };
                        CaculatePosition = function (camera, length) {
                            var NewVector = new three.Vector3(0, 0, 1);
                            NewVector.applyEuler(camera.rotation);
                            NewVector.setLength(length);
                            NewVector.subVectors(camera.position, NewVector);
                            return NewVector;
                        };
                        initPorperty();
                        moveTo = new TWEEN.Tween({ value: 0 }, TWEEN2)
                            .to({ value: 100 }, 1000)
                            .onUpdate(function (data) {
                            followCamera(data);
                        })
                            .easing(TWEEN.Easing.Exponential.InOut);
                        wait = new TWEEN.Tween({ value: 100 }, TWEEN2)
                            .onStart(initPorperty)
                            .to({ value: 100 }, 1000)
                            .onUpdate(function (data) {
                            followCamera(data);
                        });
                        showing = new TWEEN.Tween({ value: 0 }, TWEEN2)
                            .to({ value: 100 }, 3000)
                            .onStart(function () {
                            var newPosition = _this.group.worldToLocal(object.position);
                            var cameraPosition = _this.group.worldToLocal(new three.Vector3().copy(camera.position));
                            _this.group.add(object);
                            object.position.copy(newPosition);
                            object.lookAt(cameraPosition);
                            initPorperty();
                        })
                            .onUpdate(function (data) {
                            for (var index in porperty) {
                                for (var type in porperty[index]) {
                                    object[index][type] = (replaceObj[index][type] - porperty[index][type]) * data.value / 100 + porperty[index][type];
                                }
                            }
                        })
                            .onComplete(function () {
                            _this.group.remove(_this.objects[replaceIndex]);
                            _this.scene.remove(object);
                            _this.objects[replaceIndex] = object;
                        })
                            .easing(TWEEN.Easing.Exponential.InOut);
                        moveTo.chain(wait);
                        wait.chain(showing);
                        moveTo.start();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sign3D.prototype.createMesh = function (user, position) {
        if (position === void 0) { position = false; }
        return __awaiter(this, void 0, void 0, function () {
            var map, Plane, radius, material, mesh;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTexture(user.avatar)];
                    case 1:
                        map = _a.sent();
                        if (this.shape == 'Circle') {
                            radius = this.avatarSize / 2;
                            Plane = new three.CircleGeometry(radius, 30);
                        }
                        else {
                            Plane = new three.PlaneGeometry(this.avatarSize, this.avatarSize);
                        }
                        material = new three.MeshBasicMaterial({
                            color: 0xffffff,
                            side: three.DoubleSide,
                            map: map
                        });
                        mesh = new three.Mesh(Plane, material);
                        mesh.frustumCulled = true;
                        if (position === false) {
                            mesh.position.x = Math.random() * 4000 - 2000;
                            mesh.position.y = Math.random() * 4000 - 2000;
                            mesh.position.z = Math.random() * 4000 - 2000;
                            return [2 /*return*/, mesh];
                        }
                        mesh.position.x = position.x;
                        mesh.position.y = position.y;
                        mesh.position.z = position.z;
                        return [2 /*return*/, mesh];
                }
            });
        });
    };
    Sign3D.prototype.createMeshs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, user, object;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.counter)) return [3 /*break*/, 4];
                        user = _.sample(this.$users);
                        return [4 /*yield*/, this.createMesh(user)];
                    case 2:
                        object = _a.sent();
                        this.group.add(object);
                        this.objects.push(object);
                        _a.label = 3;
                    case 3:
                        i += 1;
                        return [3 /*break*/, 1];
                    case 4:
                        this.scene.add(this.group);
                        return [2 /*return*/];
                }
            });
        });
    };
    Sign3D.prototype.transform = function (target, duration) {
        var _this = this;
        return new Promise(function (resolve) {
            var targets = target.objs;
            // this.globalAnimate = false
            TWEEN.removeAll();
            for (var i = 0; i < _this.objects.length; i++) {
                var object = _this.objects[i];
                var target_1 = targets[i];
                if (typeof (target_1) == 'undefined') {
                    continue;
                }
                new TWEEN.Tween(object.position)
                    .to({
                    x: target_1.position.x,
                    y: target_1.position.y,
                    z: target_1.position.z
                }, Math.random() * duration + duration)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
                new TWEEN.Tween(object.rotation)
                    .to({
                    x: target_1.rotation.x,
                    y: target_1.rotation.y,
                    z: target_1.rotation.z
                }, Math.random() * duration + duration)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }
            setTimeout(function () {
                target.tween && target.tween(TWEEN);
                resolve();
            }, duration);
        });
    };
    Sign3D.prototype.animateInit = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var spendTime = 3000;
            _this.transform(_this.fadeout, spendTime);
            new TWEEN.Tween(_this.group.position)
                .to({
                x: 0,
                y: 0,
                z: 0
            }, spendTime)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(_this.group.rotation)
                .to({
                x: 0,
                y: 0,
                z: 0
            }, spendTime)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(_this.camera.rotation)
                .to({
                x: 0,
                y: 0,
                z: 0
            }, spendTime)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(_this.camera.position)
                .to({
                x: 0,
                y: 0,
                z: 3000
            }, spendTime)
                .onComplete(function () {
                resolve();
            })
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        });
    };
    Sign3D.prototype.loopAnimate = function () {
        var _this = this;
        var animate = this.lodashAnimates.next().value;
        if (!animate) {
            this.lodashAnimates.__index__ = 0;
            animate = this.lodashAnimates.head();
        }
        this.nowAnimate = animate;
        // 摄像机 group 归位
        this.animateInit().then(function () {
            _this.transform(animate, 3000);
        });
        setTimeout(function () {
            _this.loopAnimate();
        }, (parseInt(String(this.animateSpendTime)) + 5) * 1000);
    };
    Sign3D.prototype.render = function () {
        this.animationFrame = requestAnimationFrame(this.render.bind(this));
        TWEEN.update();
        TWEEN2.update();
        this.renderer.render(this.scene, this.camera);
    };
    Sign3D.prototype.onResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
    };
    Sign3D.prototype.initThree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options_1, animates_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.initRender();
                        options_1 = {
                            counter: this.counter,
                            group: this.group,
                            camera: this.camera,
                            rotationSpeed: 4,
                            shape: this.shape
                        };
                        this.fadeout = new Fadeout(options_1);
                        animates_1 = [];
                        this.openAnimates.forEach(function (animate) {
                            var Animate = animatesEffect[animate];
                            animates_1.push(new Animate(options_1));
                        });
                        this.lodashAnimates = ___default(animates_1);
                        return [4 /*yield*/, this.createMeshs()];
                    case 1:
                        _a.sent();
                        this.loopAnimate();
                        window.addEventListener('resize', this.onResize.bind(this), false);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Sign3D.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.initThree().then(function () {
                    _this.render();
                });
                return [2 /*return*/];
            });
        });
    };
    return Sign3D;
}(Base));

var ImageManger = /** @class */ (function () {
    function ImageManger() {
    }
    ImageManger.prototype.cache = function (url) {
        return url;
    };
    return ImageManger;
}());

exports.ImageManger = ImageManger;
exports.Lottery3d = Lottery3d;
exports.Sign3D = Sign3D;
