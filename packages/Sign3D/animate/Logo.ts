import Base from './Base'
import { Object3D } from 'three'

export default class Logo extends Base {

  constructor (options, GodRaysPass) {
    super(options)
    this.GodRaysPass = GodRaysPass
    let tableData = this.sign3DConfig.tableData
    let objs = []
    for (let i = 0; i < tableData.length; i++) {
      let object = new Object3D()

      let itemWidth = 35
      // 增加向上，减少向下
      object.position.y = -(tableData[i][1] * itemWidth) + itemWidth * 32 / 2

      // 减小向右，增加向左
      object.position.x = tableData[i][0] * itemWidth - itemWidth * 64 / 2

      objs.push(object)
    }
    this.objs = objs
  }

  tween (TWEEN) {
    let camera = this.camera
    let group = this.group
    let Time = 3000

    let PositionUpdate = (num) => {
      num = num / 100
      camera.position.y = num * 100
      camera.position.x = num * 300

      camera.lookAt(group.position)
    }

    let tween = new TWEEN.Tween({Value: 0})
      .to({Value: 100}, Time / 2)
      .easing(TWEEN.Easing.Back.InOut)
      .onUpdate((data) => {
        PositionUpdate(data.Value)
        camera.position.z = 3000 - (3000 - 2500) * data.Value / 100
      })

    let rotationTween = new TWEEN.Tween({Value: 100})
      .to({Value: -100}, Time)
      .easing(TWEEN.Easing.Back.InOut)
      .onUpdate((data) => {
        PositionUpdate(data.Value)
      })
      .yoyo(true)
      .repeat(Infinity)

    tween.chain(rotationTween)
    tween.start()

    new TWEEN.Tween({sunShine: 60})
      .to({sunShine: 100}, Time / 2)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate((data) => {
        let sunShine = data.sunShine / 100
        this.GodRaysPass.godRaysMaterial.uniforms.density.value = sunShine
        this.GodRaysPass.intensity = sunShine
      })
      .yoyo(true)
      .repeat(Infinity)
      .start()
  }

}
