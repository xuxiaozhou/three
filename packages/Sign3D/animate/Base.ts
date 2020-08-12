import {Group, Camera, Object3D} from 'three'
import {IAnimateOptions} from "../interface";

class Base {
  protected Cont: number;
  protected group: Group;
  protected camera: Camera;
  protected rotationSpeed: number;
  public objs: Object3D[];
  protected tableData: Array<[number, number]>;

  public constructor(options: IAnimateOptions) {
    this.Cont = 1000;
    this.group = options.group;
    this.camera = options.camera;
    this.rotationSpeed = options.rotationSpeed;
    this.tableData = options.tableData
  }
}

export default Base
