import TWEEN from '@tweenjs/tween.js'
import {Vector3, Object3D, Camera, Group, Math as tMath} from 'three'
import {IOption} from "../type";

export default class Sphere {
  private readonly camera: Camera;
  private readonly group: Group;
  public objs: any[];
  private lon: number = 90;

  public constructor(options: IOption) {
    this.group = options.group;
    this.camera = options.camera;

    const vector = new Vector3();
    const objs = [];
    for (let i = 0, length = options.counter; i < length; i++) {
      const phi = Math.acos(-1 + (2 * i) / length);
      const theta = Math.sqrt(length * Math.PI) * phi;

      const object = new Object3D();

      const radius = 850;
      object.position.x = radius * Math.cos(theta) * Math.sin(phi);
      object.position.y = radius * Math.sin(theta) * Math.sin(phi);
      object.position.z = radius * Math.cos(phi);

      vector.copy(object.position).multiplyScalar(2);

      object.lookAt(vector);
      objs.push(object)
    }
    this.objs = objs
  }

  public tween() {
    const Time = 5000;
    const rotationSpeed = 0.2; // 旋转速度
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
      const raio = 1500;
      return {
        z: randomNum(-raio, raio),
        x: randomNum(-raio, raio),
        y: randomNum(-raio, raio)
      }
    };

    const tween = function () {
      new TWEEN.Tween(camera.position)
        .onComplete(tween)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(function () {
          group.rotation.y -= 0.001 * rotationSpeed;
          camera.lookAt(group.position)
        })
        .to(rand(), Time)
        .start()
    };

    tween()

  }

  /**
   * 球体自转
   * @param speed
   */
  public rotation(speed = 0.5) {
    const {group} = this;

    new TWEEN.Tween({val: 0})
      .onUpdate(function () {
        group.rotation.y += 0.001 * speed
      })
      .to({val: 100}, 5000)
      .yoyo(true)
      .repeat(Infinity)
      .start()

  }

  /**
   * 摄像机旋转
   */
  public cameraRotation(speed: number = 0.2) {
    if (!this.lon) {
      this.lon = 90
    }
    let camera = this.camera;
    let length = camera.position.length();
    let group = this.group;
    new TWEEN.Tween({val: 0})
      .onUpdate(() => {
        this.lon += 0.1 * speed;
        let theta = tMath.degToRad(this.lon);
        camera.position.x = length * Math.cos(theta);
        camera.position.z = length * Math.sin(theta);
        camera.lookAt(group.position)
      })
      .to({val: 100}, 5000)
      .yoyo(true)
      .repeat(Infinity)
      .start()
  }
}
