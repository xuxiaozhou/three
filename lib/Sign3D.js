import _ from 'lodash'
import {
  Group,
  Mesh,
  Matrix4,
  MeshBasicMaterial,
  Scene,
  SphereBufferGeometry,
  TextureLoader,
  PerspectiveCamera,
  WebGLRenderer,
  PointsMaterial,
  BufferGeometry,
  BufferAttribute,
  Points,
  Color,
  CircleGeometry,
  PlaneGeometry, DoubleSide,
  Math as TMath, Vector3
} from './package/three.min'
import TWEEN from './package/Tween.min'
import {EffectComposer, GodRaysPass, RenderPass, KernelSize} from './package/postprocessing.min'
import {clampToMaxSize, defaultImageManager} from './utils'
import {Fadeout, animateMap} from './animate'
import statusMap from './constant'

const Cont = 2048 // 元素数
const Size = 35 // 每个头像大小
const TWEEN2 = new TWEEN.Group()

class Sign3D {
  constructor ({animateSpendTime = 10, callback, backgroundImage, backgroundType = '3D', dom, shineColor = '#FCECB7', openAnimates = [], shape = 'Circle', imageManager = defaultImageManager, tableData = []}) {
    this.$users = []
    this.usersIndex = {}

    this.loadedThree = false
    this.animateSpendTime = animateSpendTime
    this.backgroundImage = backgroundImage
    this.openAnimates = openAnimates
    this.backgroundType = backgroundType
    this.imageManager = imageManager
    this.dom = dom
    this.shineColor = shineColor
    this.shape = shape
    this.tableData = tableData
    this.callback = callback
    this.callback = this.callback.bind(this)
  }

  get statusMap () {
    return statusMap
  }

  set users (users) {
    this.$users = users
    if (users.length !== 0 && !this.loadedThree) {
      users.forEach((user, i) => {
        this.usersIndex[user.openid] = i
      })
      this.callback(statusMap.LOADING)
      this.threeInit().then(() => {
        this.animate()
        this.callback(statusMap.SUCCESS)
      })
      this.loadedThree = true
    }
    if (users.length === 0) {
      this.callback(statusMap.NO_USERS)
    }
  }

  async addUser (uInfo) {
    let index = this.$users.push(uInfo)
    this.usersIndex[uInfo.openid] = index - 1
    if (!this.scene) {
      return
    }

    let camera = this.camera

    let object = await this.createMesh(uInfo)
    this.scene.add(object)

    // 从当前在摄像头中播放的对象中随机取出一个
    let replaceIndex = _.random(0, this.nowanimate.objs.length - 1)
    let replaceObj = this.objects[replaceIndex]

    let porperty = {}

    // 间隔200
    let length = 200
    let randNum = {
      x: TMath.randInt(-50, 50),
      y: TMath.randInt(-30, 30),
      z: TMath.randInt(-50, 50)
    }
    // 计算物体相对于相机的朝向的 相对
    let CaculatePosition = function (camera, length) {
      let NewVector = new Vector3(0, 0, 1)
      NewVector.applyEuler(camera.rotation)
      NewVector.setLength(length)
      NewVector.subVectors(camera.position, NewVector)
      return NewVector
    }

    /**
     * 让object跟随相机移动
     * */
    function followCamera (data) {
      // 根据相机朝向 算出物品所在的相对位置
      let relative = CaculatePosition(camera, length)
      for (let index in porperty) {
        for (let type in porperty[index]) {
          if (index === 'rotation') {
            object[index][type] = (camera[index][type] - porperty[index][type]) * data.value / 100 + porperty[index][type]
          }
          if (index === 'position') {
            object[index][type] = (relative[type] + randNum[type] - porperty[index][type]) * data.value / 100 + porperty[index][type]
          }
        }
      }
    }

    /**
     * 初始化porperty 便于下次动画计算初始值与结束值
     */
    function initPorperty (world = false) {
      let position = world ? object.getWorldPosition() : object.position
      let rotation = world ? object.getWorldRotation() : object.rotation
      porperty = {
        position: {
          x: position.x,
          y: position.y,
          z: position.z
        },
        rotation: {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z
        }
      }
    }

    initPorperty()

    // 移动到摄像机前 并跟随摄像机
    let moveTo = new TWEEN.Tween({value: 0}, TWEEN2)
      .to({value: 100}, 1000)
      .onUpdate((data) => {
        followCamera(data)
      })
      .easing(TWEEN.Easing.Exponential.InOut)
    let wait = new TWEEN.Tween({value: 100}, TWEEN2)
      .onStart(initPorperty)
      .to({value: 100}, 1000)
      .onUpdate((data) => {
        followCamera(data)
      })

    let showing = new TWEEN.Tween({value: 0}, TWEEN2)
      .to({value: 100}, 3000)
      .onStart(() => {
        let newPosition = this.group.worldToLocal(object.position)
        let cameraPosition = this.group.worldToLocal(new Vector3().copy(camera.position))
        this.group.add(object)
        object.position.copy(newPosition)
        object.lookAt(cameraPosition)
        initPorperty()
      })
      .onUpdate((data) => {
        for (let index in porperty) {
          for (let type in porperty[index]) {
            object[index][type] = (replaceObj[index][type] - porperty[index][type]) * data.value / 100 + porperty[index][type]
          }
        }
      })
      .onComplete(() => {
        this.group.remove(this.objects[replaceIndex])
        this.scene.remove(object)
        this.objects[replaceIndex] = object
      })
      .easing(TWEEN.Easing.Exponential.InOut)

    moveTo.chain(wait)
    wait.chain(showing)

    moveTo.start()
  }

  destory () {
    // 取消Threejs的动画渲染 避免对内存的消耗
    this.AnimationFrame && cancelAnimationFrame(this.AnimationFrame)
  }

  animate () {
    this.AnimationFrame = requestAnimationFrame(this.animate.bind(this))
    TWEEN.update()
    TWEEN2.update()

    this.render()
  }

  getTexture (url, maxSize = false) {
    return new Promise(async (res) => {
      try {
        url = this.imageManager.cache(url)
      } catch (e) {
      }

      let textTure
      textTure = new TextureLoader().load(url, (texture) => {
          maxSize && (textTure.image = clampToMaxSize(texture.image, maxSize))
          res(textTure)
        }, () => {
        }, () => {
          console.log('图片【' + url + '】下载错误')
          res(textTure)
        }
      )
    })
  }

  CreatPassRender () {
    let renderer = this.baseRenderer
    // 创建光源 设为透明
    const sunMaterial = new PointsMaterial({
      size: 0,
      sizeAttenuation: true,
      color: 0xffddaa,
      alphaTest: 0,
      transparent: true,
      fog: false
    })
    const sunGeometry = new BufferGeometry()
    sunGeometry.addAttribute('position', new BufferAttribute(new Float32Array(3), 3))
    const sun = new Points(sunGeometry, sunMaterial)

    // 超出摄像机部分不渲染
    sun.frustumCulled = true
    sun.position.set(0, 0, -100)
    this.scene.add(sun)

    const composer = new EffectComposer(renderer)
    let renderPass = new RenderPass(this.scene, this.camera)
    composer.addPass(renderPass)

    renderPass = new GodRaysPass(this.group, this.camera, sun, {
      resolutionScale: 0.8,
      kernelSize: KernelSize.SMALL,
      intensity: 0.4,
      density: 0.86,
      decay: 0.83,
      weight: 0.4,
      exposure: 0.6,
      samples: 60,
      clampMax: 1.0
    })

    // 设置 renderPassMask 照出的部分设置颜色
    renderPass.renderPassMask = new RenderPass(renderPass.mainScene, renderPass.mainCamera, {
      overrideMaterial: new MeshBasicMaterial({color: this.shineColor}),
      clearColor: new Color(0x000000)
    })
    this.GodRaysPass = renderPass
    composer.addPass(renderPass)
    renderPass.renderToScreen = true

    this.renderer = composer
  }

  async CreatRender () {
    try {
      this.objects = []
      this.group = new Group()
      this.scene = new Scene()

      // 设置3D背景
      if (this.backgroundType === '3D') {
        const texture = await this.getTexture(this.backgroundImage)
        const material = new MeshBasicMaterial({map: texture})
        const SkyBoxSize = 4000
        const skyBox = new Mesh(new SphereBufferGeometry(SkyBoxSize, 0, 0), material)
        skyBox.applyMatrix(new Matrix4().makeScale(1, 1, -1))
        this.scene.add(skyBox)
      } else {
        this.dom.style.backgroundImage = `url(${this.backgroundImage})`
      }

      this.camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 20, 10000)
      this.camera.position.z = 3000

      const renderer = new WebGLRenderer({alpha: true})
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.domElement.style.position = 'fixed'
      renderer.domElement.style.left = 0
      // 加入渲染的Canvas到页面中
      this.dom.appendChild(renderer.domElement)
      this.baseRenderer = renderer

      this.CreatPassRender()
    } catch (e) {
      this.callback(statusMap.NOT_SUPPORTED)
    }
  }

  async createMesh (uInfo, position = false) {
    try {
      let map = await this.getTexture(uInfo.avatar, 128)

      let shape = this.shape
      let Plane
      if (shape === 'Circle') {
        let radius = Size / 2
        Plane = new CircleGeometry(radius, 30)
      } else {
        Plane = new PlaneGeometry(Size, Size)
      }
      let material = new MeshBasicMaterial({
        color: 0xffffff,
        side: DoubleSide,
        map
      })
      let mesh = new Mesh(Plane, material)
      mesh.frustumCulled = true

      if (!position) {
        mesh.position.x = Math.random() * 4000 - 2000
        mesh.position.y = Math.random() * 4000 - 2000
        mesh.position.z = Math.random() * 4000 - 2000
      } else {
        mesh.position.x = position.x
        mesh.position.y = position.y
        mesh.position.z = position.z
      }

      return mesh
    } catch (e) {
      throw e
    }
  }

  async createMeshs () {
    for (let i = 0; i < Cont; i++) {
      let uInfo = _.sample(this.$users)

      // 创建Object
      let object = await this.createMesh(uInfo)

      this.group.add(object)
      this.objects.push(object)
    }
    this.scene.add(this.group)
  }

  transform (target, duration) {
    return new Promise(resolve => {
      let targets = target.objs
      this.globalAnimate = false
      TWEEN.removeAll()
      for (let i = 0; i < this.objects.length; i++) {
        let object = this.objects[i]
        let target = targets[i]

        if (typeof (target) == 'undefined') {
          continue
        }
        new TWEEN.Tween(object.position)
          .to({
            x: target.position.x,
            y: target.position.y,
            z: target.position.z
          }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()

        new TWEEN.Tween(object.rotation)
          .to({
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z
          }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()
      }
      setTimeout(() => {
        target.tween && target.tween(TWEEN)
        resolve()
      }, duration)
    })
  }

  animateInit () {
    return new Promise(resolve => {
      const spendTime = 3000
      this.transform(this.animates.fadeout, spendTime)
      new TWEEN.Tween(this.group.position)
        .to({
          x: 0,
          y: 0,
          z: 0
        }, spendTime)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()

      new TWEEN.Tween(this.group.rotation)
        .to({
          x: 0,
          y: 0,
          z: 0
        }, spendTime)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()
      new TWEEN.Tween(this.camera.rotation)
        .to({
          x: 0,
          y: 0,
          z: 0
        }, spendTime)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()
      new TWEEN.Tween(this.camera.position)
        .to({
          x: 0,
          y: 0,
          z: 3000
        }, spendTime)
        .onComplete(() => {
          this.GodRaysPass.godRaysMaterial.uniforms.density.value = 0.83
          this.GodRaysPass.intensity = 0.4
          resolve()
        })
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()
    })
  }

  loopAnimate () {
    let animate = this.lodashAnimates.next().value
    if (!animate) {
      this.lodashAnimates.__index__ = 0
      animate = this.lodashAnimates.head()
    }

    this.nowanimate = animate

    // 摄像机 group 归位
    this.animateInit().then(() => {
      this.transform(animate, 3000)
    })

    setTimeout(() => {
      this.loopAnimate()
    }, (parseInt(this.animateSpendTime) + 5) * 1000)

  }

  async threeInit () {
    // 创建渲染器
    await this.CreatRender()
    /**
     * 以下为动画效果 生成动画效果的函数
     */
    const options = {
      Cont,
      group: this.group,
      camera: this.camera,
      rotationSpeed: 10,
      tableData: this.tableData
    }
    this.animates = {
      enabled: [],
      fadeout: new Fadeout(options)
    }

    this.openAnimates.forEach(animate => {
      this.animates.enabled.push(new animateMap[animate](options, this.GodRaysPass))
    })

    this.lodashAnimates = _(this.animates.enabled)
    // 创建 头像对象
    await this.createMeshs()

    this.loopAnimate()

    window.addEventListener('resize', this.onResize.bind(this), false)
  }

  onResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.baseRenderer.setSize(window.innerWidth, window.innerHeight)
    this.render()
  }

  render () {
    this.renderer.render()
  }
}

export default Sign3D