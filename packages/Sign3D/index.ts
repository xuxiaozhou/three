import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Group,
} from "three";
// import TWEEN from '@tweenjs/tween.js'
import {mixConfig} from "../Barrage/utils/utils";
import MeshManager from "./MeshManager";
import {IConfig, IOptions} from "./interface";
import {defaultConfig} from "./constant";
import {Fadeout, animates} from "./animate";

class Sign3D {
  private readonly config: IConfig;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private readonly scene: Scene;
  private timer: number;
  private readonly group: Group;
  private objects: any[];
  private meshManager: MeshManager;
  private animates: { fadeout: Fadeout; enabled: any[] };

  public constructor(config: IConfig) {
    this.config = mixConfig(config, defaultConfig);

    this.meshManager = new MeshManager(this.config);
    // 场景
    this.scene = new Scene();
    this.group = new Group();
    this.objects = [];
    window.addEventListener('resize', this.resize);

    this.prepareRender();
  }

  public destroy() {
    if (this.timer) {
      window.cancelAnimationFrame(this.timer);
    }

    window.removeEventListener('resize', this.resize)
  }

  private async createMeshs() {
    for (let i = 0; i < 2048; i += 1) {
      const object = await this.meshManager.createMesh();
      this.group.add(object);
      this.objects.push(object)
    }
    this.scene.add(this.group)
  }

  private render = () => {
    this.timer = window.requestAnimationFrame(this.render);
    // TWEEN.update();
    // TWEEN2.update();
    this.renderer.render(this.scene, this.camera);
  };

  private async prepareBackground() {
    const {backgroundImage, backgroundType} = this.config;

    if (backgroundType === '3D') {
      const skyBox = await this.meshManager.createSky(backgroundImage);
      this.scene.add(skyBox)
    } else {
      this.config.container.style.backgroundImage = `url(${backgroundImage})`;
    }
  }

  private async prepareRender() {
    await this.prepareBackground();
    // 摄像机
    this.camera = new PerspectiveCamera(
      40,
      // 窗口宽高比
      window.innerWidth / window.innerHeight,
      20,
      10000
    );
    this.camera.position.z = 3000;
    // 渲染器
    this.renderer = new WebGLRenderer({alpha: true});
    this.renderer.domElement.style.display = 'block';
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.config.container.appendChild(this.renderer.domElement);

    await this.createMeshs();

    this.prepareAnimate();
  }

  private prepareAnimate() {
    const options: IOptions = {
      Cont: 2048,
      group: this.group,
      camera: this.camera,
    };
    this.animates = {
      enabled: [],
      // fadeout
      fadeout: new Fadeout(options)
    };
    for (let animate of this.config.animates) {
      // options.sign3dConfig = animate;
      const Animate = animates[animate];
      this.animates.enabled.push(
        new Animate(options)
      )
    }
  }

  private resize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  };
}

export default Sign3D;
