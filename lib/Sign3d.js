import _, {sample} from 'lodash'
import {clampToMaxSize} from './utils'
import {Fadeout, animateMap} from './animate'

const {
  Group,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereBufferGeometry,
  TextureLoader,
  Matrix4,
  PerspectiveCamera,
  WebGLRenderer,
  PointsMaterial,
  BufferGeometry,
  BufferAttribute,
  Points,
  CircleGeometry,
  PlaneGeometry, DoubleSide,
  Color
} = THREE
const {EffectComposer, RenderPass, GodRaysPass, KernelSize} = POSTPROCESSING
const TWEEN2 = new TWEEN.Group()

class Sign3d {
  /**
   * @param backgroundImage
   * @param backgroundType：3D / 2D
   * @param dom
   * @param openAnimates 使用动画功能
   * @param shape 头像形状
   * @param users 用户
   * @param shineColor
   * @param animateSpendTime
   */
  constructor ({shineColor, animateSpendTime, backgroundImage, backgroundType = '2D', dom, openAnimates = [], shape = 'circle', users = []}) {
    this.count = 1024
    this.avatarSize = 35
    this.objects = []
    this.group = new Group()
    this.scene = new Scene()
    this.backgroundImage = backgroundImage
    this.backgroundType = backgroundType
    this.openAnimates = openAnimates
    this.dom = dom
    this.shape = shape
    this.users = users
    this.animateSpendTime = animateSpendTime
    this.shineColor = shineColor
  }

  animateInit () {
    return new Promise(resolve => {
      const spendTime = 3000
      this.transform(this.animatesInfo.fadeOut, spendTime)
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
          // this.GodRaysPass.godRaysMaterial.uniforms.density.value = 0.83
          // this.GodRaysPass.intensity = 0.4
          resolve()
        })
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()
    })
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

  animate () {
    this.AnimationFrame = requestAnimationFrame(this.animate.bind(this))
    TWEEN.update()
    TWEEN2.update()

    this.render()
  }

  onResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.baseRenderer.setSize(window.innerWidth, window.innerHeight)
    this.render.bind(this)()
  }

  render () {
    this.renderer.render()
  }

  async init () {
    try {
      const {backgroundType, backgroundImage, openAnimates} = this
      await this.createRender({backgroundImage, backgroundType})
      const options = {
        group: this.group,
        camera: this.camera
      }
      this.animatesInfo = {
        enabled: openAnimates.map(animate => {
          const Animate = animateMap[animate]
          return new Animate(options)
        }),
        fadeOut: new Fadeout(options)
      }
      this.lodashAnimates = _(this.animatesInfo.enabled)
      await this.createMeshs()
      this.loopAnimate()
      window.addEventListener('resize', this.onResize.bind(this), false)
      this.render()
      this.animate()
    } catch (e) {
      console.log(e)
    }
  }

  async createMesh (uInfo) {
    try {
      const map = await this.getTexture(uInfo.avatar, 128)
      let Plane
      if (this.shape === 'circle') {
        Plane = new CircleGeometry(this.avatarSize / 2, 30)
      } else {
        Plane = new PlaneGeometry(this.avatarSize, this.avatarSize)
      }
      const material = new MeshBasicMaterial({
        color: 0xffffff,
        side: DoubleSide,
        map
      })
      const mesh = new Mesh(Plane, material)
      mesh.frustumCulled = true

      mesh.position.x = Math.random() * 4000 - 2000
      mesh.position.y = Math.random() * 4000 - 2000
      mesh.position.z = Math.random() * 4000 - 2000

      return mesh
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  // 头像对象
  async createMeshs () {
    for (let i = 0; i < this.count; i++) {
      const uInfo = sample(this.users)

      // 创建Object
      const object = await this.createMesh(uInfo)

      this.group.add(object)
      this.objects.push(object)
    }
    this.scene.add(this.group)
  }

  CreatPassRender () {
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

    const composer = new EffectComposer(this.baseRenderer)
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

  async createRender ({backgroundImage, backgroundType}) {
    try {
      if (backgroundType === '3D') {
        const texture = await this.getTexture(backgroundImage)
        const material = new MeshBasicMaterial({map: texture})
        const SkyBoxSize = 4000
        const skyBox = new Mesh(new SphereBufferGeometry(SkyBoxSize, 0, 0), material)
        skyBox.applyMatrix(new Matrix4().makeScale(1, 1, -1))
        this.scene.add(skyBox)
      } else {
        this.dom.style.backgroundImage = `url(${backgroundImage})`
      }
      this.camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 20, 10000)
      this.camera.position.z = 3000

      // 原生渲染器
      this.baseRenderer = new WebGLRenderer({alpha: true})
      this.baseRenderer.setSize(window.innerWidth, window.innerHeight)
      this.baseRenderer.domElement.style.position = 'fixed'
      this.baseRenderer.domElement.style.left = 0
      this.dom.appendChild(this.baseRenderer.domElement)
      this.CreatPassRender()
    } catch (e) {
      throw new Error({
        code: 10000,
        message: '当前系统环境不支持WebGL，请检查显卡驱动等是否完全安装!',
        data: e
      })
    }
  }

  getTexture (url, maxSize = false) {
    return new Promise(async (res) => {
      try {
        // url = saveImage.cache(url)
      } catch (e) {
      }

      let textTexture

      // 第一种方式获取
      textTexture = new TextureLoader().load(url, (texture) => {
          if (maxSize) {
            textTexture.image = clampToMaxSize(texture.image, maxSize)
          }
          res(textTexture)
        }, () => {
        }, () => {
          console.log('图片【' + url + '】下载错误')
          res(textTexture)
        }
      )
    })
  }
}

export default Sign3d