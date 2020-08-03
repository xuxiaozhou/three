export default class Base {
  private Cont: number;
  constructor (options) {
    this.Cont = 1000
    this.group = options.group
    this.camera = options.camera
    this.sign3DConfig = options.sign3dConfig
  }
}
