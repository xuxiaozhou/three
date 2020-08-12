import Base from './Base'
import { Object3D } from 'three'

export default class Grid extends Base {

  constructor (options) {
    super(options)

    let objs = []
    for (let i = 0; i < this.Cont; i++) {
      let object = new Object3D()
      let offset = 180
      let colmn = 8
      object.position.x = ( ( i % colmn ) * offset ) - (offset * (colmn - 1)) / 2
      object.position.y = ( -( Math.floor(i / colmn) % colmn ) * offset ) + (offset * (colmn - 1)) / 2
      object.position.z = ( Math.floor(i / (colmn * colmn)) ) * 600 - 4000

      objs.push(object)
    }
    this.objs = objs
  }

  tween (TWEEN) {
    let Time = 5000
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
      let raio = 3000
      let height = 250
      return {
        z: randomNum(500, raio),
        x: randomNum(-height, height),
        y: randomNum(-height, height)
      }
    }

    let tween = function () {
      new TWEEN.Tween(camera.position)
        .onComplete(tween)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(function (data) {
          camera.lookAt({...group.position, ...{}})
        })
        .to(rand(), Time)
        .start()
    }

    tween()

  }

}
