import Base from './Base'
import {Vector3, Object3D} from '../package/three.min'

export default class Artascope extends Base {

  constructor (options) {
    super(options)

    let vector = new Vector3()
    let objs = []
    let radius = 200
    let everyNum = 25
    for (let i = 0; i < this.Cont; i++) {
      let e = parseInt(i / everyNum)
      let phi = Math.PI * (2 / everyNum) * (i % everyNum)
      let object = new Object3D()

      object.position.x = radius * Math.sin(phi)
      object.position.y = radius * Math.cos(phi)
      object.position.z = -e * 100 + 2800
      // group.position.z = 1200

      vector.x = object.position.x * 2
      vector.y = object.position.y * 2
      vector.z = object.position.z

      object.lookAt(vector)
      objs.push(object)
    }
    this.objs = objs
  }

  tween (TWEEN) {
    let Time = 10000
    let rotationSpeed = this.rotationSpeed // 旋转速度
    let group = this.group
    let camera = this.camera

    new TWEEN.Tween(camera.position)
      .easing(TWEEN.Easing.Quartic.InOut)
      .onUpdate(function () {
        group.rotation.z -= 0.001 * rotationSpeed
      })
      .to({z: 500}, Time)
      .yoyo(true)
      .repeat(Infinity)
      .start()

  }

}