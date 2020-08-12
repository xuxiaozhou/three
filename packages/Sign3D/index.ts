import {
  BufferAttribute,
  BufferGeometry,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereBufferGeometry,
  TextureLoader,
  WebGLRenderer
} from "three";
import {ISign3dConfig} from "./interface";
import {Texture} from "three/src/textures/Texture";
// import TWEEN from "@tweenjs/tween.js";

// Group,
class Sign3d {
  // private group: Group;
  private readonly scene: Scene;
  private config: ISign3dConfig;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  public AnimationFrame: number;

  public constructor(config: ISign3dConfig) {
    this.config = config;
    // this.group = new Group();
    this.scene = new Scene();
    this.prepareRender()
  }

  private async prepareBg() {
    const bgImg = this.config.backgroundImage;

    // 设置3D背景
    if (this.config.backgroundType === '3D') {
      const texture = await this.getTexture(bgImg);
      const material = new MeshBasicMaterial({map: texture});

      const SkyBoxSize = 4000;
      const skyBox = new Mesh(new SphereBufferGeometry(SkyBoxSize, 0, 0), material);
      skyBox.applyMatrix4(new Matrix4().makeScale(1, 1, -1));
      this.scene.add(skyBox)
    } else {
      this.config.container.style.backgroundImage = `url(${bgImg})`
    }
  }

  private getTexture(url): Promise<Texture | null> {
    return new Promise(async (resolve) => {
      const textTure = new TextureLoader();
      textTure.load(url, texture => {
          resolve(texture)
        }, () => {
        }, () => {
          console.log('图片【' + url + '】下载错误');
          resolve(null)
        }
      )
    })
  }

  private prepareLight() {
    // let renderer = this.baseRenderer
    // 创建光源 设为透明
    const sunMaterial = new PointsMaterial({
      size: 0,
      sizeAttenuation: true,
      color: 0xffddaa,
      alphaTest: 0,
      transparent: true,
      fog: false
    });
    const sunGeometry = new BufferGeometry();
    sunGeometry.setAttribute('position', new BufferAttribute(new Float32Array(3), 3));
    const sun = new Points(sunGeometry, sunMaterial);

    // 超出摄像机部分不渲染
    sun.frustumCulled = true;
    sun.position.set(0, 0, -100);
    this.scene.add(sun)
  }

  private prepareScene() {
    this.camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 20, 10000);
    this.camera.position.z = 3000;

    let renderer = new WebGLRenderer({
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.left = '0';
    // 加入渲染的Canvas到页面中
    this.config.container.appendChild(renderer.domElement);
    this.renderer = renderer;
    this.prepareLight();
    this.animate()
  }

  private prepareRender() {
    this.prepareBg().then(() => {
      this.prepareScene();
    });
  }

  private render() {
    this.renderer.render(this.scene, this.camera)
  }

  private animate() {
    this.AnimationFrame = requestAnimationFrame(this.animate.bind(this));
    // TWEEN.update()
    // TWEEN2.update()

    this.render()
  }
}

export default Sign3d
