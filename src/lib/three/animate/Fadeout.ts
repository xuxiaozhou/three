import {Object3D} from 'three'
import {IOption} from "../../type";

export default class Fadeout {
  public objs: any[];

  public constructor(options: IOption) {
    const objs = [];
    for (let i = 0; i < options.counter; i += 1) {
      const object = new Object3D();
      object.position.z = 30000;
      objs.push(object);
    }
    options.camera.position.set(0, 0, 3000);
    options.camera.lookAt(options.group.position);
    this.objs = objs;
  }
}

