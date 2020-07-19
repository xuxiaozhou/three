import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Group,
} from "three";
import {mixConfig} from "../Barrage/utils/utils";
import MeshManager from "./MeshManager";
import {IConfig} from "./interface";

class Sign3D {
  private readonly config: IConfig;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private readonly scene: Scene;
  private timer: number;
  private readonly group: Group;
  private objects: any[];
  private meshManager: MeshManager;

  public constructor(config: IConfig) {
    this.config = mixConfig(config, {
      shape: 'Circle',
    });

    this.meshManager = new MeshManager(this.config);
    // 场景
    this.scene = new Scene();
    this.group = new Group();
    this.objects = [];

    this.prepareRender();

    this.add();

    this.render();
    window.addEventListener('resize', this.resize);
  }

  public destroy() {
    if (this.timer) {
      window.cancelAnimationFrame(this.timer);
    }

    window.removeEventListener('resize', this.resize)
  }

  private async add() {
    for (let i = 0; i < 2048; i += 1) {
      const object = await this.meshManager.createMesh();
      this.group.add(object);
      this.objects.push(object)
    }
    this.scene.add(this.group)
  }

  private render = () => {
    this.timer = window.requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  };

  private prepareRender() {
    this.config.container.style.backgroundImage = `url(${this.config.backgroundImage})`;

    // 摄像机
    this.camera = new PerspectiveCamera(
      40,
      // 窗口宽高比
      window.innerWidth / window.innerHeight,
      20,
      10000
    );
    this.camera.position.z = 30;
    // 渲染器
    this.renderer = new WebGLRenderer({alpha: true});
    this.renderer.domElement.style.display = 'block';
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.config.container.appendChild(this.renderer.domElement);
  }

  private resize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  };
}

export default Sign3D;
