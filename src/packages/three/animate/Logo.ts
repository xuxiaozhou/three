import {Camera, Group, Object3D} from 'three'
import {IOption} from "../type";

export default class Logo {
  private readonly group: Group;
  private readonly camera: Camera;

  public objs: any[];

  public constructor(options: IOption) {
    const {tableData} = options;
    this.group = options.group;
    this.camera = options.camera;
    const objs = [];
    for (let i = 0; i < tableData.length; i++) {
      const object = new Object3D();

      const itemWidth = 35;
      // 增加向上，减少向下
      object.position.y = -(tableData[i][1] * itemWidth) + itemWidth * 32 / 2;

      // 减小向右，增加向左
      object.position.x = tableData[i][0] * itemWidth - itemWidth * 64 / 2;

      objs.push(object)
    }
    this.objs = objs
  }

  public tween(TWEEN) {
    const {camera, group} = this;
    const Time = 3000;

    const PositionUpdate = (num) => {
      num = num / 100;
      camera.position.y = num * 100;
      camera.position.x = num * 300;

      camera.lookAt(group.position)
    };

    const tween = new TWEEN.Tween({Value: 0})
      .to({Value: 100}, Time / 2)
      .easing(TWEEN.Easing.Back.InOut)
      .onUpdate((data) => {
        PositionUpdate(data.Value);
        camera.position.z = 3000 - (3000 - 2500) * data.Value / 100
      });

    const rotationTween = new TWEEN.Tween({Value: 100})
      .to({Value: -100}, Time)
      .easing(TWEEN.Easing.Back.InOut)
      .onUpdate((data) => {
        PositionUpdate(data.Value)
      })
      .yoyo(true)
      .repeat(Infinity);

    tween.chain(rotationTween);
    tween.start();

    new TWEEN.Tween({sunShine: 60})
      .to({sunShine: 100}, Time / 2)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        // let sunShine = data.sunShine / 100
        // this.GodRaysPass.godRaysMaterial.uniforms.density.value = sunShine
        // this.GodRaysPass.intensity = sunShine
      })
      .yoyo(true)
      .repeat(Infinity)
      .start()
  }
}
