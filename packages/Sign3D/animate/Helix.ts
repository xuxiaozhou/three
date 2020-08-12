import {Vector3, Object3D, Camera, Group} from 'three'
import {IOptions} from "../interface";
import {randomNum} from './utils';

export default class Helix {
  public objs: Object3D[];

  private readonly rotationSpeed: number;
  private readonly group: Group;
  private readonly camera: Camera;

  public constructor(options: IOptions) {
    this.rotationSpeed = options.rotationSpeed;
    this.group = options.group;
    this.camera = options.camera;
    let vector = new Vector3();
    let objs = [];
    for (let i = 0; i < 1000; i++) {
      let phi = i * 0.155 + Math.PI;
      let object = new Object3D();

      let radius = 500;

      object.position.x = radius * Math.sin(phi);
      object.position.y = -(i * 3) + radius / 2;
      object.position.z = radius * Math.cos(phi);
      // group.position.z = 1200

      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;

      object.lookAt(vector);
      objs.push(object)
    }
    this.objs = objs
  }

  public tween(TWEEN) {
    let Time = 5000;
    let rotationSpeed = this.rotationSpeed; // 旋转速度
    let camera = this.camera;
    let group = this.group;

    let tween = function () {
      const raio = 1500;
      const randomPostion = {
        z: randomNum(-raio, raio),
        x: randomNum(-raio, raio),
        // y: randomNum(-raio, raio)
      };
      new TWEEN.Tween(camera.position)
        .onComplete(tween)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(() => {
          camera.lookAt({...group.position, y: 0} as Vector3)
        })
        .to(randomPostion, Time)
        .start()
    };
    new TWEEN.Tween(group.position)
      .onUpdate(function () {
        group.rotation.y -= 0.001 * rotationSpeed
      })
      .to({y: 2000}, Time * 10)
      .yoyo(true)
      .repeat(Infinity)
      .delay(1000)
      .start();

    tween()

  }

}
