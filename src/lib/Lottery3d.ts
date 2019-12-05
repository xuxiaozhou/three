import {Group, Scene} from 'three'
import {MeshText2D} from 'three-text2d-2'
import {IConfig, IUser} from "../type";
import Base from "./Base";

class Lottery3d extends Base {
    private group: Group;
    private scene: Scene;

    constructor(config: IConfig) {
        super(config);
    }

    initThree() {
        this.group = new Group();
        this.scene = new Scene();
        this.initRender();
    }

    private getMesh(user: IUser | false) {

    }

    private createMesh(user: IUser | false) {
        if (!user) {

        }
    }

    private async createMeshs() {
        const num = this.users.length < this.counter ? this.counter : this.users.length
        for (let i = 0; i < num; i++) {
            const user = this.users[i] || false
            const object = await this.createMesh(user)
            this.group.add(object)
        }
    }

    protected async init() {
        this.initThree()
        await this.createMeshs();
    }
}

export default Lottery3d