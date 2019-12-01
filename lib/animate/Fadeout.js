import Base from './Base'
import {Object3D} from '../package/three.min'

export default class Fadeout extends Base {

  constructor (options) {
    super(options)

    let objs = []
    for (let i = 0; i < options.Cont; i++) {
      let object = new Object3D()

      // object.position.x = 0		// 向左飞出
      // object.position.y = 0
      object.position.z = 30000

      objs.push(object)
    }
    this.camera.position.set(0, 0, 3000)
    this.camera.lookAt(this.group.position)
    this.objs = objs
  }

}

