import {Vector3, Object3D, Group, Camera} from 'three'
import {IOption} from "../type";

export default class Artascope {
  private rotationSpeed: number;
  private group: Group;
  private camera: Camera;
  public objs: any[];

  constructor(options: IOption) {
    this.rotationSpeed = options.rotationSpeed;
    this.group = options.group;
    this.camera = options.camera;
    const vector = new Vector3();
    const objs = [];
    const radius = 200;
    const everyNum = 25;
    for (let i = 0; i < options.counter; i++) {
      const e = parseInt(String(i / everyNum), 10);
      const phi = Math.PI * (2 / everyNum) * (i % everyNum);
      const object = new Object3D();

      object.position.x = radius * Math.sin(phi);
      object.position.y = radius * Math.cos(phi);
      object.position.z = -e * 100 + 2800;

      vector.x = object.position.x * 2;
      vector.y = object.position.y * 2;
      vector.z = object.position.z;

      object.lookAt(vector);
      objs.push(object)
    }
    this.objs = objs
  }

  tween(TWEEN) {
    const {rotationSpeed, group, camera} = this;

    new TWEEN.Tween(camera.position)
      .easing(TWEEN.Easing.Quartic.InOut)
      .onUpdate(function () {
        group.rotation.z -= 0.001 * rotationSpeed
      })
      .to({z: 500}, 10000)
      .yoyo(true)
      .repeat(Infinity)
      .start()
  }
}
