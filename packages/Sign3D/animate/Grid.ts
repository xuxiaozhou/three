import {Object3D, Group, Camera} from 'three'
import {IOptions} from "../interface";
import {randomNum} from "./utils";

export default class Grid {
  private readonly group: Group;
  private readonly camera: Camera;

  public objs: Object3D[];

  constructor(options: IOptions) {
    let objs = [];

    this.group = options.group;
    this.camera = options.camera;

    for (let i = 0; i < options.count; i++) {
      let object = new Object3D();
      let offset = 180;
      let colmn = 8;
      object.position.x = ((i % colmn) * offset) - (offset * (colmn - 1)) / 2;
      object.position.y = (-(Math.floor(i / colmn) % colmn) * offset) + (offset * (colmn - 1)) / 2;
      object.position.z = (Math.floor(i / (colmn * colmn))) * 600 - 4000;

      objs.push(object)
    }
    this.objs = objs
  }

  public tween(TWEEN) {
    let Time = 5000;
    let camera = this.camera;
    let group = this.group;

    const raio = 3000;
    const height = 250;
    const position = {
      z: randomNum(500, raio),
      x: randomNum(-height, height),
      y: randomNum(-height, height)
    };

    const tween = () => {
      new TWEEN.Tween(camera.position)
        .onComplete(tween)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(() => {
          camera.lookAt(group.position)
        })
        .to(position, Time)
        .start()
    };

    tween()

  }

}
