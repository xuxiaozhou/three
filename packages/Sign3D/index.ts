import {
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Mesh, Scene, MeshBasicMaterial,
} from "three";

interface IConfig {
  container: HTMLElement,
  backgroundImage: string,
}

class Sign3D {
  private config: IConfig;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private scene: Scene;
  private cube: Mesh<BoxGeometry, MeshBasicMaterial>;
  private timer: number;

  public constructor(config: IConfig) {
    this.config = config;

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

  private add() {
    const geometry = new BoxGeometry();
    const material = new MeshBasicMaterial({color: 0x00ff00});
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  private render = () => {
    this.timer = window.requestAnimationFrame(this.render);
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  };

  private prepareRender() {
    this.config.container.style.backgroundImage = `url(${this.config.backgroundImage})`;
    // 场景
    this.scene = new Scene();
    // 摄像机
    this.camera = new PerspectiveCamera(
      40,
      // 窗口宽高比
      window.innerWidth / window.innerHeight,
      0.1,
      1000
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
