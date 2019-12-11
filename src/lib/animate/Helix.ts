import { Vector3, Object3D, Group, Camera } from 'three'
import { IOption } from "../type";

export default class Helix {
  private readonly group: Group;
  private readonly camera: Camera;

  private readonly rotationSpeed: number;

  public objs: any[];

  public constructor(options: IOption) {
    const vector = new Vector3();
    this.group = options.group;
    this.camera = options.camera;
    this.rotationSpeed = options.rotationSpeed;

    const objs = [];
    for (let i = 0; i < options.counter; i++) {
      const phi = i * 0.155 + Math.PI;
      const object = new Object3D();

      const radius = 500;
      object.position.x = radius * Math.sin(phi);
      object.position.y = -(i * 3) + radius / 2;
      object.position.z = radius * Math.cos(phi);

      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;

      object.lookAt(vector);
      objs.push(object)
    }
    this.objs = objs
  }

  public tween(TWEEN) {
    const Time = 5000;
    const { camera, group, rotationSpeed } = this;

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
      const radio = 1500;
      return {
        z: randomNum(-radio, radio),
        x: randomNum(-radio, radio),
      }
    };

    const tween = function () {
      new TWEEN.Tween(camera.position)
        .onComplete(tween)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(function () {
          camera.lookAt({
            ...group.position,
            y: 0
          } as Vector3)
        })
        .to(rand(), Time)
        .start()
    };
    new TWEEN.Tween(group.position)
      .onUpdate(function () {
        group.rotation.y -= 0.001 * rotationSpeed
      })
      .to({ y: 2000 }, Time * 10)
      .yoyo(true)
      .repeat(Infinity)
      .delay(1000)
      .start();
    tween()
  }
}
