import {
  PerspectiveCamera,
  WebGLRenderer,
  Texture,
  TextureLoader,
  Group,
  Scene,
  MeshBasicMaterial,
  Mesh,
  SphereBufferGeometry,
  Matrix4
} from 'three'
import { IConfig, IUser } from "../type";

abstract class Base {
  protected dom: HTMLElement;
  protected callback: (status: string, ...args: any[]) => void;
  protected backgroundType: '2D' | '3D';
  protected backgroundImage: string;
  protected $users: IUser[] = [];
  private loaded: boolean = false;

  protected camera: PerspectiveCamera;
  protected renderer: WebGLRenderer;

  protected animationFrame: number;
  protected group: Group;
  protected scene: Scene;
  protected cache: (img: string) => string;
  protected shape: 'Round' | 'Circle' = 'Round';

  protected constructor(config: IConfig) {
    const { shape = 'Round', cache, dom, callback, backgroundType = '2D', backgroundImage } = config;
    this.dom = dom;
    this.callback = callback;
    this.backgroundType = backgroundType;
    this.backgroundImage = backgroundImage
    this.group = new Group();
    this.scene = new Scene();
    this.cache = cache || (imgUrl => imgUrl)
    this.shape = shape
  }

  /**
   * 设置参会人
   * @param users
   */
  public set users(users: IUser[]) {
    this.$users = users;
    if (!this.loaded && users.length !== 0) {
      this.callback('loading');
      this.init().then(() => {
        this.loaded = true;
      });
    }
    if (users.length === 0) {
      this.callback('not user');
    }
  }

  public destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
  }

  protected async initRender() {
    try {
      if (this.backgroundType === '3D') {
        const texture = await this.getTexture(this.backgroundImage)
        const material = new MeshBasicMaterial({ map: texture })
        const SkyBoxSize = 4000
        const skyBox = new Mesh(new SphereBufferGeometry(SkyBoxSize, 0, 0), material)
        skyBox.applyMatrix(new Matrix4().makeScale(1, 1, -1))
        this.scene.add(skyBox)
      } else {
        this.dom.style.backgroundImage = `url(${this.backgroundImage})`;
      }
      this.camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 20, 10000);
      this.camera.position.z = 3000;
      this.renderer = new WebGLRenderer({ alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.domElement.style.position = 'fixed';
      this.renderer.domElement.style.left = '0px';
      this.dom.appendChild(this.renderer.domElement);
      this.createPassRender()
    } catch (e) {
      this.callback('not support')
    }
  }

  protected clampToMaxSize(image, maxSize?: number) {
    if (image.width > maxSize || image.height > maxSize) {
      const scale = maxSize / Math.max(image.width, image.height);
      // @ts-ignore
      const canvas: HTMLCanvasElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
      canvas.width = Math.floor(image.width * scale);
      canvas.height = Math.floor(image.height * scale);
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.width);
      if (this.shape === 'Circle') {
        const pattern = context.createPattern(canvas, 'no-repeat')
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.arc(canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2, 0, 2 * Math.PI)
        context.fillStyle = pattern
        context.fill()
      }
      return canvas
    }

    return image
  }

  protected getTexture(url: string, maxSize: false | number = false): Promise<Texture> {
    return new Promise(async (res) => {
      try {
        url = this.cache(url);
      } catch (e) {
      }

      let textTure;

      // 第一种方式获取
      textTure = new TextureLoader().load(url, texture => {
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

  protected abstract init();

  protected abstract createPassRender();

}

export default Base