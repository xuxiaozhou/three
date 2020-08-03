import {Object3D, Group, Camera} from 'three'
import {IOptions} from "../interface";

export default class Fadeout {
  private group: Group;
  private camera: Camera;
  public objs: Object3D[];

  constructor(options: IOptions) {
    this.group = options.group;
    this.camera = options.camera;

    const objs = [];
    for (let i = 0; i < options.Cont; i++) {
      const object = new Object3D();
      object.position.z = 30000;

      objs.push(object)
    }
    this.camera.position.set(0, 0, 3000);
    this.camera.lookAt(this.group.position);
    this.objs = objs
  }
}

