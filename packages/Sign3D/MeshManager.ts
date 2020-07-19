import {CircleGeometry, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Texture, TextureLoader} from "three";
import {IConfig} from "./interface";

// 每个头像大小
const Size = 35;

class MeshManager {
  private readonly config: IConfig;

  public constructor(config: IConfig) {
    this.config = config
  }

  public async createMesh(position = null) {
    const map = await this.getTexture('http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132');
    const {shape} = this.config;

    const material = new MeshBasicMaterial({
      color: 0xffffff,
      side: DoubleSide,
      map
    });

    const Plane = shape == 'Circle'
      ? new CircleGeometry(Size / 2, 30)
      : new PlaneGeometry(Size, Size);
    const mesh = new Mesh(Plane, material);
    mesh.frustumCulled = true;

    if (!position) {
      mesh.position.x = Math.random() * 4000 - 2000;
      mesh.position.y = Math.random() * 4000 - 2000;
      mesh.position.z = Math.random() * 4000 - 2000
    } else {
      mesh.position.x = position.x;
      mesh.position.y = position.y;
      mesh.position.z = position.z
    }

    return mesh
  }

  public getTexture(url): Promise<Texture> {
    return new Promise(async (resolve, reject) => {
      new TextureLoader().load(url, texture => {
          resolve(texture)
        }, () => {
        }, () => {
          console.log('图片【' + url + '】下载错误');
          reject()
        }
      )
    })
  }
}

export default MeshManager
