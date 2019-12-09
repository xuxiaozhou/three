import TWEEN from '@tweenjs/tween.js'
import {MeshText2D} from "three-text2d-2";
import {get, sample} from 'lodash'
import {IConfig, IPosition, IShowOption, ITurnInfo, IUser} from "../type";
import Base from "./Base";
import {Sphere} from '../animate';

const colors = ['#f06292', '#9575cd', '#ef5350', '#4fc3f7', '#4dd0e1', '#66bb6a', '#fbc02d', '#ff7043'];
const defaultShowOptions: IShowOption[] = [
  {
    type: 'variate',
    value: 'name'
  },
  {
    type: 'variate',
    value: 'avatar'
  }
];

class Lottery3d extends Base {
  protected counter: number = 100;
  private turnSelectData: object = {};
  private readonly showOption: IShowOption[];
  protected animationFrame: number;

  constructor(config: IConfig) {
    super(config);
    this.showOption = config.showOption || defaultShowOptions
  }

  private transform(target, duration) {
    return new Promise(resolve => {
      try {
        let targets = target.objs;
        TWEEN.removeAll();
        target.scale && this.group.scale.set(target.scale, target.scale, target.scale);

        let objarr = this.group.children;

        for (let i = 0; i < objarr.length; i++) {
          let object = objarr[i];
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
          target.cameraRotation && target.cameraRotation();
          resolve()
        }, duration * 2)
      } catch (e) {
        console.log(e)
      }
    })
  }

  private static turnSelect(uInfo, options: any[]): ITurnInfo {
    let image: false | string = false;
    let out = '';

    const sexTurn = function (v) {
      if (v === 1)
        return '男';
      if (v === 2)
        return '女';

      return '未知'
    };

    for (let item of options) {
      // 文本
      if (item.type === 'text') {
        out += item.value
      }
      // 变量
      if (item.type === 'variate') {
        let value = get(uInfo, item.value);
        if (item.value === 'sex') {
          value = sexTurn(value)
        }
        if (item.value === 'avatar') {
          if (!image) {
            image = value
          }
          value = ''
        }
        if (typeof value === 'undefined') {
          value = ''
        }
        out += value
      }
    }
    return {
      text: out || '未公开昵称',
      image
    }
  };

  private async turnOutPut(user: IUser) {
    if (this.turnSelectData[user.openid]) {
      return this.turnSelectData[user.openid]
    }

    let {image, text} = Lottery3d.turnSelect(user, this.showOption);
    if (text === '未公开昵称') {
      text = ''
    }

    try {
      if (image !== false) {
        const texturn = await this.getTexture(image);
        image = texturn.image
      }
    } catch (e) {
      image = false
    }

    const $return = {text, image};
    this.turnSelectData[user.openid] = $return;
    return $return
  }

  private async createMesh(user: IUser | false, position: false | IPosition = false) {
    try {
      let mesh;
      if (user === false) {
        mesh = new MeshText2D('暂无', {
          font: '40px PingFang-SC',
          fillStyle: '#ffffff',
          antialias: true
        })
      } else {
        const output = await this.turnOutPut(user);
        mesh = new MeshText2D(output.text.slice(0, 10), {
          canvas: output.image,
          font: '40px PingFang-SC',
          fillStyle: '#ffffff',
          bgColor: sample(colors),
          antialias: true
        })
      }
      mesh.material.alphaTest = 0.1;
      mesh.frustumCulled = true;

      if (position === false) {
        mesh.position.x = Math.random() * 4000 - 2000;
        mesh.position.y = Math.random() * 4000 - 2000;
        mesh.position.z = Math.random() * 4000 - 2000
      } else {
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z
      }
      return mesh
    } catch (e) {
    }
  }

  private async createMeshs() {
    const num = this.$users.length < this.counter ? this.counter : this.$users.length;
    for (let i = 0; i < num; i++) {
      const user = this.$users[i] || false;
      const object = await this.createMesh(user);
      this.group.add(object)
    }
  }

  private render() {
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
    TWEEN.update();
    this.renderer.render(this.scene, this.camera)
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  }

  protected async init() {
    try {
      this.initRender();
      await this.createMeshs();
      this.scene.add(this.group);
      this.transform(new Sphere({
        counter: this.counter,
        group: this.group,
        camera: this.camera
      }), 2000);
      this.render();
      window.addEventListener('resize', this.onResize.bind(this), false)
    } catch (e) {
      console.log(e)
    }
  }
}

export default Lottery3d
