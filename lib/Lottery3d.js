import _ from 'lodash'
import {MeshText2D} from './package/three-text2d'
import {
  Group,
  Mesh,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  Color,
  TextureLoader,
  PointsMaterial,
  MeshBasicMaterial,
  Points,
  BufferAttribute,
  SphereBufferGeometry,
  BufferGeometry,
  Matrix4,
  Clock
} from './package/three.min'
import TWEEN from './package/Tween.min'
import {
  EffectComposer,
  RenderPass,
  GodRaysPass,
  KernelSize,
  MaskPass,
  ToneMappingPass,
  ShaderPass,
  CopyMaterial,
  ClearMaskPass
} from './package/postprocessing.min'
import {clampToMaxSize, defaultImageManager, turnSelect} from './utils'
import statusMap, {defaultShowOptions} from './constant'
import Sphere from './animate/Sphere'

const Cont = 100// 元素数

class Lottery3d {
  constructor ({callback, imageManager = defaultImageManager, backgroudImage, backgroundType = '3D', dom, showOption = defaultShowOptions}) {
    this.callback = callback
    this.loadedThree = false
    this.imageManager = imageManager
    this.backgroudImage = backgroudImage
    this.backgroundType = backgroundType
    this.dom = dom
    this.turnSelectData = {}
    this.showOption = showOption
    // this.roundConfig=roundConfig

    this.$users = []
  }

  set users (users) {
    this.$users = users
    if (users.length === 0) {
      this.callback(statusMap.NO_USERS)
    } else if (!this.loadedThree) {
      this.callback(statusMap.LOADING)
      this.threeInit().then(() => {
        this.animate()
        this.callback(statusMap.SUCCESS)
      })
    }
  }

  async threeInit () {
    // 创建渲染器
    await this.CreatRender()

    // 创建 粒子对象
    await this.createMeshs()

    this.makeAnimates()

    this.transform(this.animates.sphere, 2000)

    window.addEventListener('resize', this.onResize.bind(this), false)
  }

  makeAnimates () {
    /**
     * 以下为动画效果 生成动画效果的函数
     */
    const options = {
      Cont: this.group.children.length,
      group: this.group,
      camera: this.camera
    }
    this.animates = {
      sphere: new Sphere(options, options.Cont)
    }
  }

  // 转换输出
  async turnSelect (uinfo) {
    if (this.turnSelectData[uinfo.openid]) {
      return this.turnSelectData[uinfo.openid]
    }

    let {image, text} = turnSelect(uinfo, this.showOption)
    if (text === '未公开昵称') {
      text = ''
    }

    try {
      const texturn = await this.getTexture(image, 100)
      image = texturn.image
    } catch (e) {
      image = false
    }

    const $return = {text, image}
    this.turnSelectData[uinfo.openid] = $return
    return $return
  }

  async createMeshs () {
    let num = this.$users.length < Cont ? Cont : this.$users.length
    for (let i = 0; i < num; i++) {
      let uInfo = this.$users[i] || false

      // 创建Object
      let object = await this.createMesh(uInfo)
      this.group.add(object)
    }
  }

  async createMesh (uInfo, position = false) {
    try {
      let mesh
      let colors = ['#f06292', '#9575cd', '#ef5350', '#4fc3f7', '#4dd0e1', '#66bb6a', '#fbc02d', '#ff7043']
      if (false === uInfo) {
        mesh = new MeshText2D('暂无', {
          font: '40px PingFang-SC',
          fillStyle: '#ffffff',
          antialias: true
        })
      } else {
        let output = await this.turnSelect(uInfo)

        mesh = new MeshText2D(output.text.slice(0, 10), {
          canvas: output.image,
          font: '40px PingFang-SC',
          fillStyle: '#ffffff',
          bgColor: _.sample(colors),
          antialias: true
        })
        mesh._uInfo = uInfo
      }
      mesh.material.alphaTest = 0.1
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
      console.log(e)
    }
  }

  getTexture (url, maxSize = false) {
    return new Promise(async (res, rej) => {
      let textTure

      try {
        url = this.imageManager.cache(url)
      } catch (e) {
      }

      // 第一种方式获取
      url ? textTure = new TextureLoader().load(url, (texture) => {
          maxSize && (textTure.image = clampToMaxSize(texture.image, maxSize, true))
          res(textTure)
        }, () => {
        }, () => {
          console.log('图片【' + url + '】下载错误')
          rej(textTure)
        }
      ) : rej('无url')

    })
  }

  async CreatRender () {
    this.group = new Group()
    this.scene = new Scene()
    try {
      // 设置3D背景
      if (this.backgroundType === '3D') {
        let texture
        try {
          texture = await this.getTexture(this.backgroudImage)
        } catch (e) {
          texture = e
        }
        let material = new MeshBasicMaterial({map: texture})

        let SkyBoxSize = 4000
        let skyBox = new Mesh(new SphereBufferGeometry(SkyBoxSize, 0, 0), material)
        skyBox.applyMatrix(new Matrix4().makeScale(1, 1, -1))
        this.scene.add(skyBox)
      } else {
        this.dom.style.backgroundImage = `url(${this.backgroudImage})`
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

  // 创建特效渲染器
  CreatPassRender () {
    let renderer = this.baseRenderer
    // 创建光源 设为透明
    let sunMaterial = new PointsMaterial({
      size: 0,
      sizeAttenuation: true,
      color: 0xffddaa,
      alphaTest: 0,
      transparent: true,
      fog: false
    })
    let sunGeometry = new BufferGeometry()
    sunGeometry.addAttribute('position', new BufferAttribute(new Float32Array(3), 3))
    let sun = new Points(sunGeometry, sunMaterial)

    // 超出摄像机部分不渲染
    sun.frustumCulled = true
    sun.position.set(0, 0, 100)
    this.scene2 = new Scene()
    this.scene.add(sun)
    this.scene.add(this.group)

    const composer = new EffectComposer(renderer, {
      stencilBuffer: true
    })

    let clearMaskPass = new ClearMaskPass()

    let renderBg = new RenderPass(this.sceneBg, this.camera)

    let renderPass = new RenderPass(this.scene, this.camera)

    let renderPass2 = new RenderPass(this.scene2, this.camera)
    renderPass2.clear = false

    let effectCopy = new ShaderPass(new CopyMaterial())
    effectCopy.renderToScreen = true

    let toneMappingPass = new ToneMappingPass({
      adaptive: false,
      resolution: 1,
      distinction: 1
    })
    toneMappingPass.adaptiveLuminosityMaterial.uniforms.minLuminance.value = 3
    toneMappingPass.toneMappingMaterial.uniforms.maxLuminance.value = 3
    toneMappingPass.toneMappingMaterial.uniforms.middleGrey.value = .8
    this.toneMappingPass = toneMappingPass

    let toneMappingPass2 = new ToneMappingPass({
      adaptive: false,
      resolution: 1,
      distinction: 100
    })
    toneMappingPass2.adaptiveLuminosityMaterial.uniforms.minLuminance.value = 3
    toneMappingPass2.toneMappingMaterial.uniforms.maxLuminance.value = 3
    toneMappingPass2.toneMappingMaterial.uniforms.middleGrey.value = 80

    let GodPass = new GodRaysPass(this.group, this.camera, sun, {
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
    this.GroupMask = new RenderPass(GodPass.mainScene, GodPass.mainCamera, {
      clearColor: new Color(0x000000)
    })

    this.shineGroup = new Group()

    this.ShineGroupMask = new RenderPass(this.shineGroup, GodPass.mainCamera, {
      clearColor: new Color(0x000000)
    })

    GodPass.renderPassMask = this.GroupMask
    this.GodRaysPass = GodPass

    composer.addPass(renderBg)
    composer.addPass(renderPass)
    composer.addPass(renderPass2)

    composer.addPass(new MaskPass(this.scene, this.camera))
    toneMappingPass.enabled = false
    composer.addPass(toneMappingPass)
    composer.addPass(clearMaskPass)

    composer.addPass(new MaskPass(this.shineGroup, this.camera))
    composer.addPass(toneMappingPass2)
    composer.addPass(clearMaskPass)

    composer.addPass(GodPass)

    composer.addPass(effectCopy)

    this.Clock = new Clock()
    this.renderer = composer
  }

  render () {
    try {
      this.renderer.render(this.Clock.getDelta())
    } catch (e) {
      console.log(e)
    }
  }

  onResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.baseRenderer.setSize(window.innerWidth, window.innerHeight)

    this.render()
  }

  /**
   * 切换模式
   * @param target
   * @param duration
   */
  transform (target, duration) {
    return new Promise(resolve => {
      let targets = target.objs
      TWEEN.removeAll()
      this.ready = false
      target.scale && this.group.scale.set(target.scale, target.scale, target.scale)

      let objarr = this.group.children

      for (let i = 0; i < objarr.length; i++) {
        let object = objarr[i]
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
        target.cameraRotation && target.cameraRotation(0.5, this)
        this.ready = true
        resolve()
      }, duration * 2)
    })
  }

  animate () {
    const f = () => {
      this.AnimationFrame = requestAnimationFrame(f)
      TWEEN.update()
      this.render()
    }
    f()
  }

  /**
   * 开始进入抽奖阶段
   */
  LotteryInit () {
    return new Promise((resolve, reject) => {
      if (this.enableInit) {
        reject('正在准备抽奖阶段')
        return
      }
      this.enableInit = true
      let group = this.group
      group.add(this.shineGroup)
      this.GodRaysPass.renderPassMask = this.ShineGroupMask

      this.toneMappingPass.enabled = true

      TWEEN.removeAll()

      new TWEEN.Tween(this.camera.position)
        .easing(TWEEN.Easing.Cubic.Out)
        .to(this.CaculatePosition(3500), 500)
        .onUpdate(() => {
          this.camera.lookAt(group.position)
        })
        .onComplete(() => {
          this.enableInit = false
          resolve()
        })
        .start()
    })

  }

  CaculatePosition (length) {
    let Position = this.camera.position.clone()
    return Position.setLength(length)
  }

  /**
   * 抽奖动画结束后的处理
   */
  async lotteryAfter () {
    this.Vue.lotteryStatus = 'waiting'
    await (() => {
      return new Promise(resolve => {
        TWEEN.removeAll()
        new TWEEN.Tween(this.camera.position)
          .easing(TWEEN.Easing.Cubic.Out)
          .to(this.CaculatePosition(3000), 500)
          .onComplete(() => {
            resolve()
          })
          .start()
      })
    })()
    this.GodRaysPass.renderPassMask = this.GroupMask
    this.toneMappingPass.enabled = false
    this.group.remove(this.shineGroup)
    this.makeAnimates()
    this.transform(this.animates.sphere, 1000)
  }

  /**
   * 减少加速度
   */
  slowDown () {
    // 减少的加速度
    new TWEEN.Tween(this.camera.position)
      .easing(TWEEN.Easing.Bounce.Out)
      .to(this.CaculatePosition(3000), 800)
      .start()

    new TWEEN.Tween(this.RotationSpeed)
      .easing(TWEEN.Easing.Exponential.Out)
      .to({x: 0, y: 0, z: 0}, 5000)
      .start()
  }

  /**
   * 根据一个力度旋转球体
   * @param n
   */
  pushRotation (n) {
    return new Promise(async (resolve, reject) => {
      if (this.ready !== true) {
        reject('动画尚未准备就绪，请稍后')
        return
      }
      let group = this.group

      let shineGroup = this.shineGroup

      try {
        await this.LotteryInit()
        TWEEN.removeAll()
      } catch (e) {
        return
      }

      // this.scene2.add(group)

      let max = 3000
      this.RotationSpeed = {
        x: _.random(0, max),
        y: _.random(0, max),
        z: _.random(0, max)
      }

      this.ready = false
      this.Vue.lotteryStatus = 'starting'

      let Complete = async () => {
        this.ready = false
        let objs = this.shineGroup.children

        let users = []
        this.Vue.lotteryStatus = 'awarding'
        this.Vue.showzjList = true

        let that = this
        let pushShowUser = function () {
          for (let obj of objs) {
            that.Vue.showOne(obj._uInfo)
            users.push(obj._uInfo)
          }
        }

        if (!!this.Vue.roundConfig.isPaichu) {
          // 中奖排除时的动作
          if (objs.length <= 20)
          // 完成每个头像挨个移除的动效
            await (() => {
              return new Promise(async resolve => {
                let f
                for (let obj of objs) {
                  await (() => {
                    return new Promise(R => {
                      setTimeout(() => {
                        f = this.remove(obj).then(res => {
                          this.Vue.showOne(obj._uInfo)
                        })
                        R()
                      }, 200)
                    })
                  })()
                  users.push(obj._uInfo)
                }
                // 最后一个remove结束之后执行
                f.then(res => {
                  resolve(res)
                })
              })
            })()
          else
          // 数量超过20个直接删除消失
            pushShowUser()

          this.shineGroup.remove(...objs)
        } else {
          pushShowUser()
          this.group.add(...objs)
        }

        this.lotteryAfter()

        resolve(users)
      }

      new TWEEN.Tween()
        .onUpdate(() => {
          // 是否是停止阶段
          // this.Vue.lotteryStatus === 'slowdown' && (
          // this.slowDown()
          // )

          let speed = this.RotationSpeed
          let isEmpty = true
          for (let index in speed) {
            let item = speed[index] * 0.0001
            item = item > 0 ? item : 0
            group.rotation[index] += item
            // 判断当前速度是否还有效
            item > 0 && (isEmpty = false)
          }

          // 恢复原来的状态
          let shineChildren = shineGroup.children
          shineChildren.length > 0 && group.add(...shineChildren)
          shineGroup.remove(...shineChildren)
          let paixuObj = this.getNearstObj(n)

          shineGroup.add(...paixuObj)

          // 判断是否速度都为0 结束游戏
          if (isEmpty) {
            TWEEN.removeAll()
            Complete()
          }
        })
        .repeat(Infinity)
        .start()
    })

  }

  /**
   * 获取离摄像机最近的n个元素
   * @returns {*}
   */
  getNearstObj (n, uInfo = true) {
    let group = this.group
    let camera = this.camera
    let paixuObj = _.orderBy(group.children, function (obj) {
      if (obj._uInfo || uInfo === false) {
        let vector = new Vector3()
        vector.subVectors(obj.getWorldPosition(), camera.position)
        return vector.length()
      }
    }, 'asc')
    paixuObj = _.filter(_.take(paixuObj, n), function (o) {
      if (uInfo === false) {
        return true
      }
      return typeof o._uInfo !== 'undefined'
    })
    return paixuObj
  }

  /**
   * 从数组对象中动画删除元素
   * @param obj
   */
  remove (obj) {
    return new Promise(resolve => {
      let camera = this.camera.clone()
      let cameraPosition = this.group.worldToLocal(camera.position)

      new TWEEN.Tween(obj.position)
        .easing(TWEEN.Easing.Back.In)
        .to(cameraPosition, 1000)
        .onComplete(res => {
          resolve()
        })
        .start()

      let newObj = obj.clone()
      newObj.lookAt(cameraPosition)

      // newObj.lookAt(camera.position)
      let {x, y, z} = newObj.rotation

      new TWEEN.Tween(obj.rotation)
        .to({x, y, z}, 800)
        .start()
    })
  }
}

export default Lottery3d