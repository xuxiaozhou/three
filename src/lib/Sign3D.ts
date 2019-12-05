import {
    PerspectiveCamera,
    WebGLRenderer,
    Group,
    Scene,
    CircleGeometry,
    PlaneGeometry,
    MeshBasicMaterial,
    DoubleSide, Mesh,
    Math as TMath,
    Vector3
} from "three";
import TWEEN from '@tweenjs/tween.js'
import _ from 'lodash'
import Fadeout from "./animate/Fadeout";
import * as animatesEffect from './animate/index'
import {IConfig, IUser, IOption, IPosition} from "../type";
import Base from "./Base";

const TWEEN2 = new TWEEN.Group();

class Sign3D extends Base {
    private objects: any[] = [];
    private avatarSize: number = 35;
    private group: Group;
    private scene: Scene;
    private fadeout: Fadeout;
    private readonly openAnimates: string[];
    private readonly shape: 'Circle' | 'Round';
    private lodashAnimates: any;
    private readonly animateSpendTime: number;
    private animationFrame: number;
    private nowAnimate: any;

    protected counter: number = 1000;
    protected camera: PerspectiveCamera;
    protected renderer: WebGLRenderer;

    constructor(config: IConfig) {
        super(config);
        const {animateSpendTime = 10, openAnimates, shape = 'Round'} = config
        this.openAnimates = openAnimates;
        this.shape = shape;
        this.animateSpendTime = animateSpendTime;
        this.addUser = this.addUser.bind(this);
    }

    /**
     * 新增参会人
     * @param user
     */
    public async addUser(user: IUser) {
        this.$users.push(user)

        if (!this.scene) {
            return
        }
        const {camera} = this
        const object = await this.createMesh(user)
        this.scene.add(object)
        const replaceIndex = _.random(0, this.nowAnimate.objs.length - 1)
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
        function followCamera(data) {
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
        function initPorperty(world = false) {
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

    public destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame)
        }
    }

    private async createMesh(user: IUser, position: false | IPosition = false) {
        const map = await this.getTexture(user.avatar);
        let Plane;
        if (this.shape == 'Circle') {
            const radius = this.avatarSize / 2;
            Plane = new CircleGeometry(radius, 30)
        } else {
            Plane = new PlaneGeometry(this.avatarSize, this.avatarSize)
        }
        const material = new MeshBasicMaterial({
            color: 0xffffff,
            side: DoubleSide,
            map
        });
        const mesh = new Mesh(Plane, material);
        mesh.frustumCulled = true;

        if (position === false) {
            mesh.position.x = Math.random() * 4000 - 2000;
            mesh.position.y = Math.random() * 4000 - 2000;
            mesh.position.z = Math.random() * 4000 - 2000;
            return mesh
        }
        mesh.position.x = (position as IPosition).x;
        mesh.position.y = (position as IPosition).y;
        mesh.position.z = (position as IPosition).z;
        return mesh
    }

    private async createMeshs() {
        for (let i = 0; i < this.counter; i += 1) {
            const user = _.sample(this.$users);
            const object = await this.createMesh(user);
            this.group.add(object);
            this.objects.push(object)
        }
        this.scene.add(this.group)
    }

    private transform(target, duration) {
        return new Promise(resolve => {
            const targets = target.objs;
            // this.globalAnimate = false
            TWEEN.removeAll();
            for (let i = 0; i < this.objects.length; i++) {
                let object = this.objects[i];
                let target = targets[i];

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
                    .start();

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
                target.tween && target.tween(TWEEN);
                resolve()
            }, duration)
        })

    }

    private animateInit() {
        return new Promise(resolve => {
            const spendTime = 3000;
            this.transform(this.fadeout, spendTime);
            new TWEEN.Tween(this.group.position)
                .to({
                    x: 0,
                    y: 0,
                    z: 0
                }, spendTime)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

            new TWEEN.Tween(this.group.rotation)
                .to({
                    x: 0,
                    y: 0,
                    z: 0
                }, spendTime)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(this.camera.rotation)
                .to({
                    x: 0,
                    y: 0,
                    z: 0
                }, spendTime)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(this.camera.position)
                .to({
                    x: 0,
                    y: 0,
                    z: 3000
                }, spendTime)
                .onComplete(() => {
                    resolve()
                })
                .easing(TWEEN.Easing.Exponential.InOut)
                .start()
        })
    }

    private loopAnimate() {
        let animate = this.lodashAnimates.next().value;
        if (!animate) {
            this.lodashAnimates.__index__ = 0;
            animate = this.lodashAnimates.head();
        }

        this.nowAnimate = animate

        // 摄像机 group 归位
        this.animateInit().then(() => {
            this.transform(animate, 3000)
        });

        setTimeout(() => {
            this.loopAnimate()
        }, (parseInt(String(this.animateSpendTime)) + 5) * 1000)
    }

    private render() {
        this.animationFrame = requestAnimationFrame(this.render.bind(this));
        TWEEN.update();
        TWEEN2.update();
        this.renderer.render(this.scene, this.camera)
    }

    private onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
    }

    private async initThree() {
        try {
            this.group = new Group();
            this.scene = new Scene();
            this.initRender();
            const options: IOption = {
                counter: this.counter,
                group: this.group,
                camera: this.camera,
                rotationSpeed: 4,
                shape: this.shape
            };
            this.fadeout = new Fadeout(options);
            const animates: any[] = [];
            this.openAnimates.forEach(animate => {
                const Animate = animatesEffect[animate];
                animates.push(new Animate(options))
            });
            this.lodashAnimates = _(animates);
            await this.createMeshs();
            this.loopAnimate();
            window.addEventListener('resize', this.onResize.bind(this), false)
        } catch (e) {
            console.log(e)
        }
    }

    protected async init() {
        this.initThree().then(() => {
            this.render();
        })
    }
}

export default Sign3D