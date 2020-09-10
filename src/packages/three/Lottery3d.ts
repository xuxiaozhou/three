// import TWEEN from '@tweenjs/tween.js'
// import {
//   PointsMaterial,
//   BufferAttribute,
//   Points,
//   Scene,
//   BufferGeometry,
//   Color,
//   Group,
//   Clock,
//   Vector3
// } from 'three'
// import {
//   get,
//   random,
//   orderBy,
//   take,
//   filter
// } from 'lodash'
// import {
//   EffectComposer,
//   RenderPass,
//   GodRaysPass,
//   KernelSize,
//   MaskPass,
//   ToneMappingPass,
//   ShaderPass,
//   CopyMaterial,
//   ClearMaskPass
// } from './utils/postprocessing'
// import MeshText2D from './MeshText2D/MeshText2D'
// import {IConfig, IPosition, IShowOption, ITurnInfo, IUser} from "./type";
// import Base from "./Base";
// import {Sphere} from './animate';
// import {defaultShowOptions} from './utils/constant'
//
// class Lottery3d extends Base {
//   protected minCount: number = 100;
//   private turnSelectData: object = {};
//   private readonly showOption: IShowOption[];
//   private scene2: Scene;
//   private GroupMask: Group;
//   private shineGroup: Group;
//   private ShineGroupMask: any;
//   private GodRaysPass: any;
//   private toneMappingPass: any;
//   private Clock: Clock;
//   protected passRenderer: any;
//   private ready: boolean;
//   private enableInit: boolean;
//   private RotationSpeed: { x: number, y: number, z: number };
//   private readonly fillStyle: string;
//   private readonly bgColor: string;
//   private readonly fontSize: string;
//   private remove: boolean;
//   private readonly getPaichuConfig: () => boolean;
//
//   public constructor(config: IConfig) {
//     super(config);
//     this.getPaichuConfig = config.getPaichuConfig;
//     this.remove = false;
//     this.showOption = config.showOption || defaultShowOptions;
//     this.shape = 'Circle';
//     this.minCount = config.minCount || 100;
//     this.fillStyle = config.filleStyle || '#fff';
//     this.bgColor = config.bgColor;
//     this.fontSize = config.fontSize || '30px';
//     this.render = this.render.bind(this)
//   }
//
//   private CaculatePosition(length) {
//     const Position = this.camera.position.clone();
//     return Position.setLength(length)
//   }
//
//   public destroy() {
//     super.destroy();
//     this.remove = true;
//     window.removeEventListener('resize', this.onResize.bind(this), false)
//   }
//
//   public stop() {
//     // 减少的加速度
//     new TWEEN.Tween(this.camera.position)
//       .easing(TWEEN.Easing.Bounce.Out)
//       .to(this.CaculatePosition(3000), 800)
//       .start();
//
//     new TWEEN.Tween(this.RotationSpeed)
//       .easing(TWEEN.Easing.Exponential.Out)
//       .to({x: 0, y: 0, z: 0}, 5000)
//       .start()
//   }
//
//   public start(count: number) {
//     return new Promise(async (resolve) => {
//       if (this.ready !== true) {
//         this.callback('lottery not ready');
//         return
//       }
//       const {group} = this;
//
//       try {
//         await this.LotteryInit();
//         TWEEN.removeAll()
//       } catch (e) {
//         return
//       }
//
//       const max = 3000;
//       this.RotationSpeed = {
//         x: random(0, max),
//         y: random(0, max),
//         z: random(0, max)
//       };
//
//       this.ready = false;
//       this.callback('lottery starting');
//
//       let Complete = async () => {
//         this.ready = false;
//         let objs = this.shineGroup.children;
//
//         let users = [];
//         this.callback('lottery awarding');
//
//         let pushShowUser = () => {
//           for (let obj of objs) {
//             this.callback('showOne', obj._uInfo);
//             users.push(obj._uInfo)
//           }
//         };
//
//         if (this.getPaichuConfig()) {
//           // 中奖排除时的动作
//           if (objs.length <= 20)
//             // 完成每个头像挨个移除的动效
//             await (() => {
//               return new Promise(async resolve => {
//                 let f;
//                 for (let obj of objs) {
//                   await (() => {
//                     return new Promise(R => {
//                       setTimeout(() => {
//                         f = this.removeElement(obj).then(() => {
//                           this.callback('showOne', obj._uInfo)
//                         });
//                         R()
//                       }, 200)
//                     })
//                   })();
//                   users.push(obj._uInfo)
//                 }
//                 // 最后一个remove结束之后执行
//                 f.then(res => {
//                   resolve(res)
//                 })
//               })
//             })();
//           else {
//             // 数量超过20个直接删除消失
//             pushShowUser()
//           }
//           this.shineGroup.remove(...objs)
//         } else {
//           pushShowUser();
//           this.group.add(...objs)
//         }
//
//         this.lotteryAfter();
//
//         this.callback('lottery end');
//
//         resolve(users)
//       };
//
//       new TWEEN.Tween()
//         .onUpdate(() => {
//           let speed = this.RotationSpeed;
//           let isEmpty = true;
//           for (let index in speed) {
//             let item = speed[index] * 0.0001;
//             item = item > 0 ? item : 0;
//             group.rotation[index] += item;
//             // 判断当前速度是否还有效
//             if (item > 0) {
//               isEmpty = false
//             }
//           }
//
//           // 恢复原来的状态
//           let shineChildren = this.shineGroup.children;
//           shineChildren.length > 0 && group.add(...shineChildren);
//           this.shineGroup.remove(...shineChildren);
//           let paixuObj = this.getNearstObj(count);
//
//           this.shineGroup.add(...paixuObj);
//
//           // 判断是否速度都为0 结束游戏
//           if (isEmpty) {
//             TWEEN.removeAll();
//             Complete()
//           }
//         })
//         .repeat(Infinity)
//         .start()
//     })
//   }
//
//   /**
//    * 开始进入抽奖阶段
//    */
//   private LotteryInit() {
//     return new Promise(resolve => {
//       if (this.enableInit) {
//         this.callback('lottery prepare');
//         return
//       }
//       this.enableInit = true;
//       let group = this.group;
//       group.add(this.shineGroup);
//       this.GodRaysPass.renderPassMask = this.ShineGroupMask;
//
//       this.toneMappingPass.enabled = true;
//
//       TWEEN.removeAll();
//
//       new TWEEN.Tween(this.camera.position)
//         .easing(TWEEN.Easing.Cubic.Out)
//         .to(this.CaculatePosition(3500), 500)
//         .onUpdate(() => {
//           this.camera.lookAt(group.position)
//         })
//         .onComplete(() => {
//           this.enableInit = false;
//           resolve()
//         })
//         .start()
//     })
//
//   }
//
//   /**
//    * 抽奖动画结束后的处理
//    */
//   private async lotteryAfter() {
//     this.callback('lottery waiting');
//     await (() => {
//       return new Promise(resolve => {
//         TWEEN.removeAll();
//         new TWEEN.Tween(this.camera.position)
//           .easing(TWEEN.Easing.Cubic.Out)
//           .to(this.CaculatePosition(3000), 500)
//           .onComplete(() => {
//             resolve()
//           })
//           .start()
//       })
//     })();
//     this.GodRaysPass.renderPassMask = this.GroupMask;
//     this.toneMappingPass.enabled = false;
//     this.group.remove(this.shineGroup);
//     this.transform(new Sphere({
//       counter: this.group.children.length,
//       group: this.group,
//       camera: this.camera
//     }), 2000);
//   }
//
//
//   private removeElement(obj) {
//     return new Promise(resolve => {
//       let camera = this.camera.clone();
//       let cameraPosition = this.group.worldToLocal(camera.position);
//
//       new TWEEN.Tween(obj.position)
//         .easing(TWEEN.Easing.Back.In)
//         .to(cameraPosition, 1000)
//         .onComplete(() => {
//           resolve()
//         })
//         .start();
//
//       let newObj = obj.clone();
//       newObj.lookAt(cameraPosition);
//
//       // newObj.lookAt(camera.position)
//       let {x, y, z} = newObj.rotation;
//
//       new TWEEN.Tween(obj.rotation)
//         .to({x, y, z}, 800)
//         .start()
//     })
//   }
//
//   /**
//    * 获取离摄像机最近的n个元素
//    */
//   private getNearstObj(n, uInfo = true) {
//     let group = this.group;
//     let camera = this.camera;
//     let paixuObj = orderBy(group.children, obj => {
//       if (obj._uInfo || uInfo === false) {
//         let vector = new Vector3();
//         vector.subVectors(obj.getWorldPosition(), camera.position);
//         return vector.length()
//       }
//     }, 'asc');
//     paixuObj = filter(take(paixuObj, n), function (o) {
//       if (uInfo === false) {
//         return true
//       }
//       return typeof o._uInfo !== 'undefined'
//     });
//     return paixuObj
//   }
//
//   private transform(target, duration) {
//     return new Promise(resolve => {
//       try {
//         let targets = target.objs;
//         TWEEN.removeAll();
//         this.ready = false;
//         target.scale && this.group.scale.set(target.scale, target.scale, target.scale);
//
//         let objarr = this.group.children;
//
//         for (let i = 0; i < objarr.length; i++) {
//           let object = objarr[i];
//           let target = targets[i];
//
//           if (typeof (target) == 'undefined') {
//             continue
//           }
//           new TWEEN.Tween(object.position)
//             .to({
//               x: target.position.x,
//               y: target.position.y,
//               z: target.position.z
//             }, Math.random() * duration + duration)
//             .easing(TWEEN.Easing.Exponential.InOut)
//             .start();
//
//           new TWEEN.Tween(object.rotation)
//             .to({
//               x: target.rotation.x,
//               y: target.rotation.y,
//               z: target.rotation.z
//             }, Math.random() * duration + duration)
//             .easing(TWEEN.Easing.Exponential.InOut)
//             .start()
//         }
//
//         setTimeout(() => {
//           target.cameraRotation && target.cameraRotation();
//           this.ready = true;
//           resolve()
//         }, duration * 2)
//       } catch (e) {
//         console.log(e)
//       }
//     })
//   }
//
//   private static turnSelect(uInfo, options: any[]): ITurnInfo {
//     let image: false | string = false;
//     let out = '';
//
//     const sexTurn = function (v) {
//       if (v === 1)
//         return '男';
//       if (v === 2)
//         return '女';
//
//       return '未知'
//     };
//
//     for (let item of options) {
//       // 文本
//       if (item.type === 'text') {
//         out += item.value
//       }
//       // 变量
//       if (item.type === 'variate') {
//         let value = get(uInfo, item.value);
//         if (item.value === 'sex') {
//           value = sexTurn(value)
//         }
//         if (item.value === 'avatar') {
//           if (!image) {
//             image = value
//           }
//           value = ''
//         }
//         if (typeof value === 'undefined') {
//           value = ''
//         }
//         out += value
//       }
//     }
//     return {
//       text: out || '未公开昵称',
//       image
//     }
//   };
//
//   private async turnOutPut(user: IUser) {
//     if (this.turnSelectData[user.openid]) {
//       return this.turnSelectData[user.openid]
//     }
//
//     let {image, text} = Lottery3d.turnSelect(user, this.showOption);
//     if (text === '未公开昵称') {
//       text = ''
//     }
//
//     try {
//       if (image !== false) {
//         const texturn = await this.getTexture(image, 100);
//         image = texturn.image
//       }
//     } catch (e) {
//       image = false
//     }
//
//     const $return = {text, image};
//     this.turnSelectData[user.openid] = $return;
//     return $return
//   }
//
//   private async createMesh(user: IUser | false, position: false | IPosition = false) {
//     try {
//       let mesh;
//       if (user === false) {
//         mesh = new MeshText2D('暂无', {
//           font: '40px PingFang-SC',
//           fillStyle: '#ffffff',
//           antialias: true
//         })
//       } else {
//         const output = await this.turnOutPut(user);
//         const config: { bgColor?: string } = {};
//         if (this.bgColor) {
//           config.bgColor = this.bgColor
//         }
//         mesh = new MeshText2D(output.text.slice(0, 10), {
//           canvas: output.image,
//           font: this.fontSize + ' PingFang-SC',
//           fillStyle: this.fillStyle,
//           antialias: true,
//           ...config
//         });
//         mesh._uInfo = user
//       }
//       mesh.material.alphaTest = 0.1;
//       mesh.frustumCulled = true;
//
//       if (position === false) {
//         mesh.position.x = Math.random() * 4000 - 2000;
//         mesh.position.y = Math.random() * 4000 - 2000;
//         mesh.position.z = Math.random() * 4000 - 2000
//       } else {
//         mesh.position.x = position.x;
//         mesh.position.y = position.y;
//         mesh.position.z = position.z
//       }
//       return mesh
//     } catch (e) {
//     }
//   }
//
//   private async createMeshs() {
//     const num = this.$users.length < this.minCount ? this.minCount : this.$users.length;
//     for (let i = 0; i < num; i++) {
//       const user = this.$users[i] || false;
//       const object = await this.createMesh(user);
//       this.group.add(object)
//     }
//   }
//
//   private passRender() {
//     this.passRenderer.render(this.Clock.getDelta());
//   }
//
//   private render() {
//     if (!this.remove) {
//       this.animationFrame = requestAnimationFrame(this.render);
//       TWEEN.update();
//       this.passRender()
//     }
//   }
//
//   private onResize() {
//     this.camera.aspect = window.innerWidth / window.innerHeight;
//     this.camera.updateProjectionMatrix();
//     if (this.renderer) {
//       this.renderer.setSize(window.innerWidth, window.innerHeight);
//     }
//     this.passRender()
//   }
//
//   protected async init() {
//     try {
//       await this.initRender();
//       await this.createMeshs();
//       this.scene.add(this.group);
//       this.transform(new Sphere({
//         counter: this.group.children.length,
//         group: this.group,
//         camera: this.camera
//       }), 2000);
//       this.render();
//       window.addEventListener('resize', this.onResize.bind(this), false)
//     } catch (e) {
//       console.log(e)
//     }
//   }
//
//   protected createPassRender() {
//     const {renderer} = this;
//     // 创建光源 设为透明
//     const sunMaterial = new PointsMaterial({
//       size: 0,
//       sizeAttenuation: true,
//       color: 0xffddaa,
//       alphaTest: 0,
//       transparent: true,
//       fog: false
//     });
//     const sunGeometry = new BufferGeometry();
//     sunGeometry.addAttribute('position', new BufferAttribute(new Float32Array(3), 3));
//     const sun = new Points(sunGeometry, sunMaterial);
//
//     // 超出摄像机部分不渲染
//     sun.frustumCulled = true;
//     sun.position.set(0, 0, 100);
//     this.scene2 = new Scene();
//     this.scene.add(sun);
//     this.scene.add(this.group);
//
//     const composer = new EffectComposer(renderer, {stencilBuffer: true,});
//     const clearMaskPass = new ClearMaskPass();
//     const renderPass = new RenderPass(this.scene, this.camera);
//     const renderPass2 = new RenderPass(this.scene2, this.camera);
//     renderPass2.clear = false;
//
//     const effectCopy = new ShaderPass(new CopyMaterial());
//     effectCopy.renderToScreen = true;
//
//     const toneMappingPass = new ToneMappingPass({
//       adaptive: false,
//       resolution: 1,
//       distinction: 1
//     });
//     toneMappingPass.adaptiveLuminosityMaterial.uniforms.minLuminance.value = 3;
//     toneMappingPass.toneMappingMaterial.uniforms.maxLuminance.value = 3;
//     toneMappingPass.toneMappingMaterial.uniforms.middleGrey.value = .8;
//     this.toneMappingPass = toneMappingPass;
//
//     const toneMappingPass2 = new ToneMappingPass({
//       adaptive: false,
//       resolution: 1,
//       distinction: 100
//     });
//     toneMappingPass2.adaptiveLuminosityMaterial.uniforms.minLuminance.value = 3;
//     toneMappingPass2.toneMappingMaterial.uniforms.maxLuminance.value = 3;
//     toneMappingPass2.toneMappingMaterial.uniforms.middleGrey.value = 80;
//
//     const GodPass = new GodRaysPass(this.group, this.camera, sun, {
//       resolutionScale: 0.8,
//       kernelSize: KernelSize.SMALL,
//       intensity: 0.4,
//       density: 0.86,
//       decay: 0.83,
//       weight: 0.4,
//       exposure: 0.6,
//       samples: 60,
//       clampMax: 1.0
//     });
//
//     // 设置 renderPassMask 照出的部分设置颜色
//     this.GroupMask = new RenderPass(GodPass.mainScene, GodPass.mainCamera, {
//       clearColor: new Color(0x000000)
//     });
//
//     this.shineGroup = new Group();
//
//     this.ShineGroupMask = new RenderPass(this.shineGroup, GodPass.mainCamera, {
//       clearColor: new Color(0x000000)
//     });
//
//     GodPass.renderPassMask = this.GroupMask;
//     this.GodRaysPass = GodPass;
//
//     // composer.addPass(renderBg)
//     composer.addPass(renderPass);
//     composer.addPass(renderPass2);
//
//     composer.addPass(new MaskPass(this.scene, this.camera));
//     toneMappingPass.enabled = false;
//     composer.addPass(toneMappingPass);
//     composer.addPass(clearMaskPass);
//
//     composer.addPass(new MaskPass(this.shineGroup, this.camera));
//     composer.addPass(toneMappingPass2);
//     composer.addPass(clearMaskPass);
//
//     composer.addPass(GodPass);
//
//     composer.addPass(effectCopy);
//
//     this.Clock = new Clock();
//
//     this.passRenderer = composer
//   }
// }
//
// export default Lottery3d
