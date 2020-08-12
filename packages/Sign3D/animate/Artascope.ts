import {Vector3, Object3D, Group, Camera} from 'three';
import {IOptions} from "../interface";

const radius = 200;
const everyNum = 25;

export default class Artascope {
  // 元素个数
  private count: number = 2048;
  private group: Group;
  private readonly camera: Camera;
  private rotationSpeed: number;

  public objs: Object3D[];

  public constructor(options: IOptions) {
    this.group = options.group;
    this.camera = options.camera;
    this.rotationSpeed = options.rotationSpeed;

    const vector = new Vector3();
    let objs = [];
    for (let i = 0; i < this.count; i++) {
      let e = parseInt(`${i / everyNum}`);
      let phi = Math.PI * (2 / everyNum) * (i % everyNum);
      let object = new Object3D();

      object.position.x = radius * Math.sin(phi);
      object.position.y = radius * Math.cos(phi);
      object.position.z = -e * 100 + 2800;
      // group.position.z = 1200

      vector.x = object.position.x * 2;
      vector.y = object.position.y * 2;
      vector.z = object.position.z;

      object.lookAt(vector);
      objs.push(object);
    }
    this.objs = objs;
  }

  public tween(TWEEN) {
    let Time = 10000;

    new TWEEN.Tween(this.camera.position)
      .easing(TWEEN.Easing.Quartic.InOut)
      .onUpdate(() => {
        this.group.rotation.z -= 0.001 * this.rotationSpeed;
      })
      .to({z: 500}, Time)
      .yoyo(true)
      .repeat(Infinity)
      .start();

  }

}
