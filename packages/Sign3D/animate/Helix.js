import Base from './Base'
import { Vector3, Object3D } from 'three'

export default class Helix extends Base {

  constructor (options) {
    super(options)

    let vector = new Vector3()
    let objs = []
    for (let i = 0; i < this.Cont; i++) {
      let phi = i * 0.155 + Math.PI
      let object = new Object3D()

      let radius = 500

      object.position.x = radius * Math.sin(phi)
      object.position.y = -( i * 3 ) + radius / 2
      object.position.z = radius * Math.cos(phi)
      // group.position.z = 1200

      vector.x = object.position.x * 2
      vector.y = object.position.y
      vector.z = object.position.z * 2

      object.lookAt(vector)
      objs.push(object)
    }
    this.objs = objs
  }

  tween (TWEEN) {
    let Time = 5000
    let rotationSpeed = this.sign3DConfig.rotationSpeed // 旋转速度
    let camera = this.camera
    let group = this.group

    let rand = function () {
      //生成从minNum到maxNum的随机数
      function randomNum (minNum, maxNum) {
        switch (arguments.length) {
          case 1:
            return parseInt(Math.random() * minNum + 1, 10)
            break
          case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
            break
          default:
            return 0
            break
        }
      }

      // 随机位置的最大值
      let raio = 1500
      return {
        z: randomNum(-raio, raio),
        x: randomNum(-raio, raio),
        // y: randomNum(-raio, raio)
      }
    }

    let tween = function () {
      new TWEEN.Tween(camera.position)
        .onComplete(tween)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(function (data) {
          camera.lookAt({...group.position, ...{y: 0}})
        })
        .to(rand(), Time)
        .start()
    }
    new TWEEN.Tween(group.position)
      .onUpdate(function () {
        group.rotation.y -= 0.001 * rotationSpeed
      })
      .to({y: 2000}, Time * 10)
      .yoyo(true)
      .repeat(Infinity)
      .delay(1000)
      .start()

    tween()

  }

}
