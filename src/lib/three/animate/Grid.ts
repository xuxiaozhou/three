import {Object3D, Camera, Group, Vector3} from 'three'
import {IOption} from "../../type";

export default class Grid {
  private readonly group: Group;

  private readonly camera: Camera;

  public objs: any[];

  public constructor(options: IOption) {
    this.group = options.group;
    this.camera = options.camera;

    const objs = [];
    for (let i = 0; i < options.counter; i += 1) {
      const object = new Object3D();
      const offset = 180;
      const colmn = 8;
      object.position.x = ((i % colmn) * offset) - (offset * (colmn - 1)) / 2;
      object.position.y = (-(Math.floor(i / colmn) % colmn) * offset) + (offset * (colmn - 1)) / 2;
      object.position.z = (Math.floor(i / (colmn * colmn))) * 600 - 4000;

      objs.push(object)
    }
    this.objs = objs
  }

  public tween(TWEEN) {
    const Time = 5000;
    const {camera, group} = this;

    const rand = function () {
      //生成从minNum到maxNum的随机数
      function randomNum(minNum, maxNum) {
        switch (arguments.length) {
          case 1:
            return parseInt(String(Math.random() * minNum + 1), 10);
          case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          default:
            return 0;
        }
      }

      // 随机位置的最大值
      const raio = 3000;
      const height = 250;
      return {
        z: randomNum(500, raio),
        x: randomNum(-height, height),
        y: randomNum(-height, height)
      }
    };

    const tween = function () {
      new TWEEN.Tween(camera.position)
        .onComplete(tween)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(function () {
          camera.lookAt({...group.position} as Vector3);
        })
        .to(rand(), Time)
        .start()
    };
    tween()
  }
}
