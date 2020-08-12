import TWEEN from '@tweenjs/tween.js'
import {Vector3, Object3D, Camera, Group, MathUtils} from 'three'
import {IOptions} from "../interface";
import {randomNum} from './utils';

export default class Sphere {
  public objs: Object3D[];
  private readonly camera: Camera;
  private readonly group: Group;

  public constructor(options: IOptions) {
    this.camera = options.camera;
    this.group = options.group;
    let vector = new Vector3();
    let objs = [];
    for (let i = 0, length = options.count; i < length; i++) {
      let phi = Math.acos(-1 + (2 * i) / length);
      let theta = Math.sqrt(length * Math.PI) * phi;

      let object = new Object3D();

      let radius = 850;
      if (options.count > 100) {
        radius = Math.sqrt(options.count * 7230);
        // this.scale = 850 / radius < 1 ? 850 / radius : 1
      }
      object.position.x = radius * Math.cos(theta) * Math.sin(phi);
      object.position.y = radius * Math.sin(theta) * Math.sin(phi);
      object.position.z = radius * Math.cos(phi);
      // console.log(object.scale)

      vector.copy(object.position).multiplyScalar(2);

      object.lookAt(vector);
      objs.push(object)
    }
    this.objs = objs
  }

  public tween() {
    let Time = 5000;
    let rotationSpeed = 0.2; // 旋转速度
    let camera = this.camera;
    let group = this.group;

    let rand = function () {
      // 随机位置的最大值
      let raio = 1500;
      return {
        z: randomNum(-raio, raio),
        x: randomNum(-raio, raio),
        y: randomNum(-raio, raio)
      }
    };

    let tween = function () {
      new TWEEN.Tween(camera.position)
        .onComplete(tween)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(function (data) {
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
  rotation(speed = 0.2) {
    let rotationSpeed = speed; // 旋转速度
    let group = this.group;

    new TWEEN.Tween({val: 0})
      .onUpdate(function () {
        group.rotation.y += 0.001 * rotationSpeed
      })
      .to({val: 100}, 5000)
      .yoyo(true)
      .repeat(Infinity)
      // todo xx
      .start(1000)
  }

  /**
   * 摄像机旋转
   * @param speed
   */
  cameraRotation(speed = 0.2, Vue) {
    !Vue.lon && (Vue.lon = 90);
    let camera = this.camera;
    let length = camera.position.length();
    let group = this.group;
    new TWEEN.Tween({val: 0})
      .onUpdate(() => {
        Vue.lon += 0.1 * speed;
        let theta = MathUtils.degToRad(Vue.lon);
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