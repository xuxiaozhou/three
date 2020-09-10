import {
  Matrix4,
  SphereBufferGeometry,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  Scene,
  CircleGeometry,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide, Mesh,
  Math as TMath,
  Vector3,
  PointsMaterial,
  BufferGeometry,
  BufferAttribute,
  Points,
  Color,
  Texture,
  TextureLoader,
} from "three";
import TWEEN from '@tweenjs/tween.js'
import _ from 'lodash'
import {EffectComposer, RenderPass, GodRaysPass, KernelSize} from './utils/postprocessing'
import Fadeout from "./animate/Fadeout";
import * as animatesEffect from './animate'
import {IUser, IOption, IPosition} from "./type";
import {mixConfig} from "../utils/utils";

const TWEEN2 = new TWEEN.Group();

type IAnimate = 'Sphere' | 'Logo' | 'Artascope' | 'Grid' | 'Helix'

interface ISign3DConfig {
  container?: HTMLElement,
  backgroundImage?: string,
  backgroundType?: '2D' | '3D',
  shape?: 'Circle' | 'Round',
  openAnimates?: IAnimate[],
  animateSpendTime?: number,
  tableData?: Array<[string, string]>,
  shineColor?: string,
  avatarSize?: number,
  counter?: number,
  cache?: (img: string) => string,
  callback?: (type?: string, data?: any) => void
}

const defaultConfig: ISign3DConfig = {
  backgroundType: '2D',
  shape: 'Circle',
  animateSpendTime: 15,
  openAnimates: ['Sphere', 'Logo', 'Artascope', 'Grid', 'Helix'],
  shineColor: '#FCECB7',
  avatarSize: 35,
  counter: 1000
};

class Sign3D {
  private objects: any[] = [];
  private fadeout: Fadeout;
  private nowAnimate: any;

  protected group: Group;
  protected scene: Scene;
  protected animationFrame: number;
  protected camera: PerspectiveCamera;
  protected renderer: WebGLRenderer;

  protected passRenderer: any;
  private GodRaysPass: any;
  protected lodashAnimates: any;
  private timer = null;
  private remove: boolean = false;

  private readonly config: ISign3DConfig;
  private $users: IUser[] = [];
  private loaded: boolean = false;

  public constructor(config: ISign3DConfig) {
    this.config = mixConfig(config, defaultConfig);
    this.group = new Group();
    this.scene = new Scene();
    this.remove = false;
    this.addUser = this.addUser.bind(this);
  }

  public set users(users: IUser[]) {
    this.$users = users;

    if (users.length === 0) {
      this.config.callback('info', 'not user');
      return;
    }

    if (!this.loaded) {
      this.config.callback('status', 'loading');
      this.init()
    }
  }

  public destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
    this.renderer = null;
    this.passRenderer = null;
    if (this.config.container) {
      this.config.container.innerHTML = '';
      this.config.container.style.backgroundImage = ''
    }
    this.remove = true;
    this.lodashAnimates = null;
    if (this.timer) {
      clearTimeout(this.timer)
    }
    window.removeEventListener('resize', this.onResize.bind(this), false)
  }

  /**
   * 新增参会人
   * @param user
   */
  public async addUser(user: IUser) {
    this.$users.push(user);

    if (!this.loaded) {
      return
    }
    const {camera} = this;
    const object = await this.createMesh(user);
    this.scene.add(object);
    const replaceIndex = _.random(0, this.nowAnimate.objs.length - 1);
    let replaceObj = this.objects[replaceIndex];

    let porperty = {};

    // 间隔200
    let length = 200;
    let randNum = {
      x: TMath.randInt(-50, 50),
      y: TMath.randInt(-30, 30),
      z: TMath.randInt(-50, 50),
    };
    // 计算物体相对于相机的朝向的 相对
    let CaculatePosition = function (camera, length) {
      let NewVector = new Vector3(0, 0, 1);
      NewVector.applyEuler(camera.rotation);
      NewVector.setLength(length);
      NewVector.subVectors(camera.position, NewVector);
      return NewVector
    };

    /**
     * 让object跟随相机移动
     * */
    function followCamera(data) {
      // 根据相机朝向 算出物品所在的相对位置
      let relative = CaculatePosition(camera, length);
      for (let index in porperty) {
        for (let type in porperty[index]) {
          if (index === 'rotation') {
            object[index][type] = (camera[index][type] - porperty[index][type]) * data.value / 100 + porperty[index][type]
          }
          if (index === 'position') {
            object[index][type] = (relative[type] + randNum[type] - porperty[index][type]) * data.value / 100 + porperty[index][type]
          }
        }
      }
    }

    /**
     * 初始化porperty 便于下次动画计算初始值与结束值
     */
    function initPorperty(world = false) {
      let position = world ? object.getWorldPosition() : object.position;
      let rotation = world ? object.getWorldRotation() : object.rotation;
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
      }
    }

    initPorperty();

    // 移动到摄像机前 并跟随摄像机
    let moveTo = new TWEEN.Tween({value: 0}, TWEEN2)
      .to({value: 100}, 1000)
      .onUpdate((data) => {
        followCamera(data)
      })
      .easing(TWEEN.Easing.Exponential.InOut);
    let wait = new TWEEN.Tween({value: 100}, TWEEN2)
      .onStart(initPorperty)
      .to({value: 100}, 1000)
      .onUpdate((data) => {
        followCamera(data)
      });

    let showing = new TWEEN.Tween({value: 0}, TWEEN2)
      .to({value: 100}, 3000)
      .onStart(() => {
        let newPosition = this.group.worldToLocal(object.position);
        let cameraPosition = this.group.worldToLocal(new Vector3().copy(camera.position));
        this.group.add(object);
        object.position.copy(newPosition);
        object.lookAt(cameraPosition);
        initPorperty()
      })
      .onUpdate((data) => {
        for (let index in porperty) {
          for (let type in porperty[index]) {
            object[index][type] = (replaceObj[index][type] - porperty[index][type]) * data.value / 100 + porperty[index][type]
          }
        }
      })
      .onComplete(() => {
        this.group.remove(this.objects[replaceIndex]);
        this.scene.remove(object);
        this.objects[replaceIndex] = object
      })
      .easing(TWEEN.Easing.Exponential.InOut);

    moveTo.chain(wait);
    wait.chain(showing);

    moveTo.start()
  }

  private clampToMaxSize(image, maxSize?: number) {
    if (image.width > maxSize || image.height > maxSize) {
      const scale = maxSize / Math.max(image.width, image.height);
      // @ts-ignore
      const canvas: HTMLCanvasElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
      canvas.width = Math.floor(image.width * scale);
      canvas.height = Math.floor(image.height * scale);
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.width);
      if (this.config.shape === 'Circle') {
        const pattern = context.createPattern(canvas, 'no-repeat');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.arc(canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2, 0, 2 * Math.PI);
        context.fillStyle = pattern;
        context.fill()
      }
      return canvas
    }

    return image
  }

  private getTexture(url: string, maxSize: false | number = false): Promise<Texture> {
    return new Promise(async (res) => {
      try {
        url = this.config.cache(url);
      } catch (e) {
      }

      let textTure;

      // 第一种方式获取
      textTure = new TextureLoader().load(
        url, texture => {
          if (maxSize !== false) {
            textTure.image = this.clampToMaxSize(texture.image, maxSize);
          }
          res(textTure)
        }, () => {
        }, () => {
          console.log('图片【' + url + '】下载错误');
          res(textTure)
        }
      )
    })
  }

  private async createMesh(user: IUser, position: false | IPosition = false) {
    const map = await this.getTexture(user.avatar, 128);
    let Plane;
    const {avatarSize, shape} = this.config;
    if (shape == 'Circle') {
      const radius = avatarSize / 2;
      Plane = new CircleGeometry(radius, 30)
    } else {
      Plane = new PlaneGeometry(avatarSize, avatarSize)
    }
    const material = new MeshBasicMaterial({
      color: 0xffffff,
      side: DoubleSide,
      map
    });
    const mesh = new Mesh(Plane, material);
    mesh.frustumCulled = true;

    if (position === false) {
      mesh.position.x = Math.random() * 4000 - 2000;
      mesh.position.y = Math.random() * 4000 - 2000;
      mesh.position.z = Math.random() * 4000 - 2000;
      return mesh
    }
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;
    return mesh
  }

  private async createMeshs() {
    for (let i = 0; i < this.config.counter; i += 1) {
      const user = _.sample(this.$users);
      const object = await this.createMesh(user);
      this.group.add(object);
      this.objects.push(object)
    }
    this.scene.add(this.group)
  }

  private transform(target, duration) {
    return new Promise(resolve => {
      const targets = target.objs;
      TWEEN.removeAll();
      for (let i = 0; i < this.objects.length; i++) {
        let object = this.objects[i];
        let target = targets[i];

        if (typeof (target) == 'undefined') {
          continue
        }
        new TWEEN.Tween(object.position)
          .to({
            x: target.position.x,
            y: target.position.y,
            z: target.position.z
          }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to({
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z
          }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()
      }
      setTimeout(() => {
        target.tween && target.tween(TWEEN);
        resolve()
      }, duration)
    })

  }

  private animateInit() {
    return new Promise(resolve => {
      const spendTime = 3000;
      this.transform(this.fadeout, spendTime);
      new TWEEN.Tween(this.group.position)
        .to({
          x: 0,
          y: 0,
          z: 0
        }, spendTime)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

      new TWEEN.Tween(this.group.rotation)
        .to({
          x: 0,
          y: 0,
          z: 0
        }, spendTime)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
      new TWEEN.Tween(this.camera.rotation)
        .to({
          x: 0,
          y: 0,
          z: 0
        }, spendTime)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
      new TWEEN.Tween(this.camera.position)
        .to({
          x: 0,
          y: 0,
          z: 3000
        }, spendTime)
        .onComplete(() => {
          this.GodRaysPass.godRaysMaterial.uniforms.density.value = 0.83;
          this.GodRaysPass.intensity = 0.4;
          resolve()
        })
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()
    })
  }

  private loopAnimate() {
    if (this.remove) {
      return
    }

    let animate = this.lodashAnimates.next().value;
    if (!animate) {
      this.lodashAnimates.__index__ = 0;
      animate = this.lodashAnimates.head();
    }

    this.nowAnimate = animate;

    // 摄像机 group 归位
    this.animateInit().then(() => {
      this.transform(animate, 3000)
    });

    this.timer = setTimeout(() => {
      this.loopAnimate()
    }, (parseInt(String(this.config.animateSpendTime)) + 5) * 1000)
  }

  private render() {
    if (this.loaded) {
      this.animationFrame = requestAnimationFrame(this.render.bind(this));
      TWEEN.update();
      TWEEN2.update();
      if (this.passRenderer) {
        this.passRenderer.render()
      }
    }
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  }

  private async initRender() {
    try {
      if (this.config.backgroundType === '3D') {
        const texture = await this.getTexture(this.config.backgroundImage);
        const material = new MeshBasicMaterial({map: texture});
        const SkyBoxSize = 4000;
        const skyBox = new Mesh(new SphereBufferGeometry(SkyBoxSize, 0, 0), material);
        skyBox.applyMatrix(new Matrix4().makeScale(1, 1, -1));
        this.scene.add(skyBox);
      } else {
        this.config.container.style.backgroundImage = `url(${this.config.backgroundImage})`;
      }
      this.camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 20, 10000);
      this.camera.position.z = 3000;
      this.renderer = new WebGLRenderer({alpha: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.domElement.style.position = 'fixed';
      this.renderer.domElement.style.left = '0px';
      this.config.container.appendChild(this.renderer.domElement);
      this.createPassRender()
    } catch (e) {
      this.config.callback('error', 'not support');
      throw new Error('not support')
    }
  }

  private async initThree() {
    try {
      await this.initRender();
      const options: IOption = {
        counter: this.config.counter,
        group: this.group,
        camera: this.camera,
        rotationSpeed: 4,
        shape: this.config.shape,
        tableData: this.config.tableData
      };
      this.fadeout = new Fadeout(options);
      const animates: any[] = [];
      this.config.openAnimates.forEach(animate => {
        const Animate = animatesEffect[animate];
        animates.push(new Animate(options))
      });
      this.lodashAnimates = _(animates);
      await this.createMeshs();
      this.loopAnimate();
      window.addEventListener('resize', this.onResize.bind(this), false)
    } catch (e) {
      // console.log(e)
    }
  }

  protected async init() {
    await this.initThree();
    this.loaded = true;
    this.config.callback('status', 'loaded');
    this.render();
  }

  protected createPassRender() {
    const {renderer} = this;
    const sunMaterial = new PointsMaterial({
      size: 0,
      sizeAttenuation: true,
      color: 0xffddaa,
      alphaTest: 0,
      transparent: true,
      fog: false
    });
    const sunGeometry = new BufferGeometry();
    sunGeometry.addAttribute('position', new BufferAttribute(new Float32Array(3), 3));
    const sun = new Points(sunGeometry, sunMaterial);

    // 超出摄像机部分不渲染
    sun.frustumCulled = true;
    sun.position.set(0, 0, -100);
    this.scene.add(sun);

    const composer = new EffectComposer(renderer);
    let renderPass = new RenderPass(this.scene, this.camera);
    composer.addPass(renderPass);

    renderPass = new GodRaysPass(this.group, this.camera, sun, {
      resolutionScale: 0.8,
      kernelSize: KernelSize.SMALL,
      intensity: 0.4,
      density: 0.86,
      decay: 0.83,
      weight: 0.4,
      exposure: 0.6,
      samples: 60,
      clampMax: 1.0
    });

    // 设置 renderPassMask 照出的部分设置颜色
    renderPass.renderPassMask = new RenderPass(renderPass.mainScene, renderPass.mainCamera, {
      overrideMaterial: new MeshBasicMaterial({color: this.config.shineColor}),
      clearColor: new Color(0x000000)
    });
    this.GodRaysPass = renderPass;
    composer.addPass(renderPass);
    renderPass.renderToScreen = true;
    this.passRenderer = composer
  }
}

export default Sign3D
