<script>
	import {
		Group,
		Mesh,
		PerspectiveCamera,
		Scene,
		Vector3,
		Object3D,
		WebGLRenderer,
		Texture,
		Color,
		TextureLoader,
		PlaneGeometry,
		CircleGeometry,
		PointsMaterial,
		MeshBasicMaterial,
		DoubleSide,
		Points,
		BufferAttribute,
		SphereBufferGeometry,
		BufferGeometry,
		Matrix4,
		CubeGeometry,
		Math as TMath,
		FogExp2
	} from 'three'

	import { EffectComposer, RenderPass, GodRaysPass, KernelSize } from 'postprocessing'
	import animates from '../threejs/animate'

	import TWEEN from '@tweenjs/tween.js'
	import UserModal from '@/modal/users'

	const TWEEN2 = new TWEEN.Group()
	const Cont = 2048 // 元素数
	let Size = 35 // 每个头像大小
	export default {
		data () {
			return {
				loadText: '加载中...',
				users: [],
				usersIndex: {},
				socketEvents: {
					pushUserInfo (data) {
						let index = this.usersIndex[data.openid]
						if (typeof index === 'undefined' || typeof this.users[index] === 'undefined') {
							this.addUser(data)
						}
					}
				},
			}
		},
		watch: {
			users (value) {
				if (value.length !== 0 && !this.loadedThree) {
					this.loadText = '加载中...'
					this.threeInit().then(res => {
						this.animate()
						this.loadText = null
					})
					this.loadedThree = true
				}
				if (value.length === 0) {
					this.loadText = '暂无签到用户'
				}
			}

		},
		computed: {
			/**
			 * 当前轮数的配置封装
			 * */
			sign3dConfig: {
				get () {
					return this.$store.state.roundConfig
				}
			},
		},
		mounted () {
			this.__init()
		},
		methods: {
			__init () {
				this.$emit('resize')
				this.loading('获取用户信息中...')

				this.animates = {}
				UserModal.select(this.config.eventId).then(res => {
					this.loaded()
					this.users = res
					for (let i = 0; i < res.length; i++) {
						let item = res[i]
						this.usersIndex[item.openid] = i
					}
				}).catch(e => {
					console.error(e)
				})
			},
			// 新增用户
			async addUser (uInfo) {
				let index = this.users.push(uInfo)
				this.usersIndex[uInfo.openid] = index - 1
				if (!this.scene) return

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
					z: TMath.randInt(-50, 50),
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
						//            object.rotation.copy(camera)
						//            let relative = CaculatePosition(camera, length)
						//            object.position.copy(relative)
						//            object.updateMatrixWorld(true)
					})
					.onUpdate((data) => {
						for (let index in porperty) {
							for (let type in porperty[index]) {
								object[index][type] = (replaceObj[index][type] - porperty[index][type]) * data.value / 100 + porperty[index][type]
							}
						}
					})
					.onComplete(res => {
						this.group.remove(this.objects[replaceIndex])
						this.scene.remove(object)
						this.objects[replaceIndex] = object
					})
					.easing(TWEEN.Easing.Exponential.InOut)

				moveTo.chain(wait)
				wait.chain(showing)

				moveTo.start()

			},
			/**
			 * 压缩图片
			 * @param image
			 * @param maxSize
			 * @returns {*}
			 */
			clampToMaxSize (image, maxSize) {

				if (image.width > maxSize || image.height > maxSize) {

					var scale = maxSize / Math.max(image.width, image.height)

					var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')
					canvas.width = Math.floor(image.width * scale)
					canvas.height = Math.floor(image.height * scale)

					var context = canvas.getContext('2d')
					context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)

					return canvas

				}

				return image

			},
			getTexture (url, maxSize = false) {
				return new Promise(async (res, rej) => {

					try {
						url = saveImage.cache(url)
					} catch (e) {
					}

					let textTure

					// 第一种方式获取
					textTure = new TextureLoader().load(url, (texture) => {
							maxSize && (textTure.image = this.clampToMaxSize(texture.image, maxSize))
							res(textTure)
						}, () => {
						}, (xhr) => {
							console.log('图片【' + url + '】下载错误')
							res(textTure)
						}
					)

				})

			},
			async createMeshs () {

				for (let i = 0; i < Cont; i++) {
					let uInfo = _.sample(this.users)

					// 创建Object
					let object = await this.createMesh(uInfo)

					this.group.add(object)
					this.objects.push(object)
				}
				this.scene.add(this.group)

			},
			async createMesh (uInfo, position = false) {
				try {
					let map = await this.getTexture(uInfo.avatar, 200)

					let shape = this.sign3dConfig.shape
					let Plane
					if (shape == 'Circle') {
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

			},
			// 创建特效渲染器
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
					overrideMaterial: new MeshBasicMaterial({color: this.sign3dConfig.shineColor}),
					clearColor: new Color(0x000000)
				})
				this.GodRaysPass = renderPass
				composer.addPass(renderPass)
				renderPass.renderToScreen = true

				this.renderer = composer
			},
			async CreatRender () {
				try {
					this.objects = []
					this.group = new Group()
					this.scene = new Scene()

					// 设置3D背景
					let bgImg = this.sign3dConfig.backgroud
					if (this.sign3dConfig.backgroundType === '3D') {
						let texture = await this.getTexture(bgImg)
						let material = new MeshBasicMaterial({map: texture})

						let SkyBoxSize = 4000
						let skyBox = new Mesh(new SphereBufferGeometry(SkyBoxSize, 0, 0), material)
						//                let skyBox = new Mesh(new CubeGeometry(SkyBoxSize*2, SkyBoxSize*2, SkyBoxSize*2), material)
						skyBox.applyMatrix(new Matrix4().makeScale(1, 1, -1))
						this.scene.add(skyBox)
					} else {
						this.$refs.Canvas3d.style.backgroundImage = `url(${bgImg})`
					}

					this.camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 20, 10000)
					this.camera.position.z = 3000

					let renderer = new WebGLRenderer({
						alpha: true
					})
					renderer.setSize(window.innerWidth, window.innerHeight)
					renderer.domElement.style.position = 'fixed'
					renderer.domElement.style.left = 0
					// 加入渲染的Canvas到页面中
					this.$refs.Canvas3d.appendChild(renderer.domElement)
					this.baseRenderer = renderer

					this.CreatPassRender()
				} catch (e) {
					// console.warn(e)
					let msg = '当前系统环境不支持WebGL，请检查显卡驱动等是否完全安装!'
					this.$message(msg)
					this.loadText = msg
					throw e
				}

			},
			async threeInit () {
				// 创建渲染器
				await this.CreatRender()

				/**
				 * 以下为动画效果 生成动画效果的函数
				 */
				let options = {
					Cont: Cont,
					group: this.group,
					camera: this.camera,
				}
				this.animates = {
					enabled: [],
					// fadeout
					fadeout: new animates.Fadeout(options)
				}

				for (let animate of this.sign3dConfig.animates) {
					options.sign3dConfig = animate
					this.animates.enabled.push(new animates[animate.name](options, this.GodRaysPass))
				}

				this.lodashAnimates = _(this.animates.enabled)
				// 创建 头像对象
				await this.createMeshs()

				this.loopAnimate()

				// 创建 粒子
				//  new Sprites( this.scene, TWEEN)

				window.addEventListener('resize', this.onResize, false)

			},
			/**
			 * 定时切换动画
			 * */
			loopAnimate () {

				let animate = this.lodashAnimates.next().value
				if (!animate) {
					this.lodashAnimates.__index__ = 0
					animate = this.lodashAnimates.head()
				}

				this.nowanimate = animate

				// 摄像机 group 归位
				this.animateInit().then(res => {
					this.transform(animate, 3000)
				})

				setTimeout(() => {
					this.loopAnimate()
				}, (parseInt(this.sign3dConfig.animateSpendTime) + 5) * 1000)

			},
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
						.onComplete(res => {
							this.GodRaysPass.godRaysMaterial.uniforms.density.value = 0.83
							this.GodRaysPass.intensity = 0.4
							resolve()
						})
						.easing(TWEEN.Easing.Exponential.InOut)
						.start()
				})
			},

			render () {
				this.renderer.render()
			},

			onResize () {

				this.camera.aspect = window.innerWidth / window.innerHeight
				this.camera.updateProjectionMatrix()

				this.baseRenderer.setSize(window.innerWidth, window.innerHeight)

				this.render()
			},
			/**
			 * 切换模式
			 * @param target
			 * @param duration
			 */
			transform (target, duration) {
				return new Promise(resolve => {
					let targets = target.objs
					this.globalAnimate = false
					TWEEN.removeAll()
					for (let i = 0; i < this.objects.length; i++) {
						let object = this.objects[i]
						let target = targets[i]

						if (typeof(target) == 'undefined') {
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

			},

			animate () {
				this.AnimationFrame = requestAnimationFrame(this.animate)
				TWEEN.update()
				TWEEN2.update()

				this.render()
			}
		}
		, beforeRouteLeave (to, from, next) {
			// 导航离开该组件的对应路由时调用
			this.AnimationFrame && cancelAnimationFrame(this.AnimationFrame) // 取消Threejs的动画渲染 避免对内存的消耗
			next()
		}
		, beforeRouteEnter (to, from, next) {
			// 从别的组件进入时刷新
			next()
			if (from.name !== null) {
				location.reload(true)
			}
		}
	}
</script>
