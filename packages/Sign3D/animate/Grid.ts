import Base from './Base'
import {Object3D} from 'three'
import {randomNum} from './utils';
import {Vector3} from "three/src/math/Vector3";

export default class Grid extends Base {
  public constructor(options) {
    super(options);

    const objs = [];
    for (let i = 0; i < this.Cont; i++) {
      let object = new Object3D();
      let offset = 180;
      let colmn = 8;
      object.position.x = ((i % colmn) * offset) - (offset * (colmn - 1)) / 2;
      object.position.y = (-(Math.floor(i / colmn) % colmn) * offset) + (offset * (colmn - 1)) / 2;
      object.position.z = (Math.floor(i / (colmn * colmn))) * 600 - 4000;

      objs.push(object)
    }
    this.objs = objs
  }

  tween(TWEEN) {
    let Time = 5000;
    let camera = this.camera;
    let group = this.group;

    let rand = function () {
      // 随机位置的最大值
      let raio = 3000;
      let height = 250;
      return {
        z: randomNum(500, raio),
        x: randomNum(-height, height),
        y: randomNum(-height, height)
      }
    };

    let tween = function () {
      new TWEEN.Tween(camera.position)
        .onComplete(tween)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(() => {
          camera.lookAt({...group.position} as Vector3)
        })
        .to(rand(), Time)
        .start()
    };

    tween()

  }

}
