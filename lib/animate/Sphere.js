// import TWEEN from '@tweenjs/tween.js'
const {Vector3, Object3D, Math: tMath} = THREE

export default class Sphere {

  constructor (options, Cont = false) {
    this.Cont = 1000
    this.group = options.group
    this.camera = options.camera

    typeof Cont === 'number' && (this.Cont = Cont)

    let vector = new Vector3()
    let objs = []
    for (let i = 0, length = this.Cont; i < length; i++) {
      let phi = Math.acos(-1 + (2 * i) / length)
      let theta = Math.sqrt(length * Math.PI) * phi

      let object = new Object3D()

      let radius = 850
      if (Cont > 100) {
        radius = Math.sqrt(Cont * 7230)
        this.scale = 850 / radius < 1 ? 850 / radius : 1
      }
      object.position.x = radius * Math.cos(theta) * Math.sin(phi)
      object.position.y = radius * Math.sin(theta) * Math.sin(phi)
      object.position.z = radius * Math.cos(phi)
      // console.log(object.scale)

      vector.copy(object.position).multiplyScalar(2)

      object.lookAt(vector)
      objs.push(object)
    }
    this.objs = objs
  }

  tween () {
    let Time = 5000
    let rotationSpeed = 0.2 // 旋转速度
    let camera = this.camera
    let group = this.group

    let rand = function () {
      //生成从minNum到maxNum的随机数
      function randomNum (minNum, maxNum) {
        switch (arguments.length) {
          case 1:
            return parseInt(Math.random() * minNum + 1, 10)
          case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
          default:
            return 0
        }
      }

      // 随机位置的最大值
      let raio = 1500
      return {
        z: randomNum(-raio, raio),
        x: randomNum(-raio, raio),
        y: randomNum(-raio, raio)
      }
    }

    let tween = function () {
      new TWEEN.Tween(camera.position)
        .onComplete(tween)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(function (data) {
          group.rotation.y -= 0.001 * rotationSpeed
          camera.lookAt(group.position)
        })
        .to(rand(), Time)
        .start()
    }

    tween()

  }

  /**
   * 球体自转
   * @param speed
   */
  rotation (speed = 0.2) {
    let rotationSpeed = speed // 旋转速度
    let camera = this.camera
    let group = this.group

    new TWEEN.Tween({val: 0})
      .onUpdate(function () {
        group.rotation.y += 0.001 * rotationSpeed
      })
      .to({val: 100}, 5000)
      .yoyo(true)
      .repeat(Infinity)
      .start()

  }

  /**
   * 摄像机旋转
   * @param speed
   */
  cameraRotation (speed = 0.2, Vue) {
    !Vue.lon && (Vue.lon = 90)
    let camera = this.camera
    let length = camera.position.length()
    let group = this.group
    new TWEEN.Tween({val: 0})
      .onUpdate(() => {
        Vue.lon += 0.1 * speed
        let theta = tMath.degToRad(Vue.lon)
        camera.position.x = length * Math.cos(theta)
        camera.position.z = length * Math.sin(theta)
        camera.lookAt(group.position)
      })
      .to({val: 100}, 5000)
      .yoyo(true)
      .repeat(Infinity)
      .start()
  }
}
