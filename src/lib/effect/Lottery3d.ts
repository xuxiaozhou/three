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
  // private ready: boolean;
  // private enableInit: boolean;
  // private RotationSpeed: { x: number; y: number; z: number };

  constructor(config: IConfig) {
    super(config);
    this.showOption = config.showOption || defaultShowOptions
  }

  public stop() {

  }

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

  private transform(target, duration) {
    return new Promise(resolve => {
      try {
        let targets = target.objs;
        TWEEN.removeAll();
        // this.ready = false;
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
          // this.ready = true;
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