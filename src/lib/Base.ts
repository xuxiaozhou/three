import {PerspectiveCamera, WebGLRenderer, Texture, TextureLoader} from 'three'
import {IConfig, IUser} from "../type";

abstract class Base {
    protected dom: HTMLElement;
    protected callback: (status: string) => void;
    protected backgroundType: '2D' | '3D';
    protected backgroundImage: string;
    protected $users: IUser[] = [];
    private loaded: boolean = false;

    protected abstract camera;
    protected abstract renderer;
    protected abstract counter;

    protected constructor(config: IConfig) {
        const {dom, callback, backgroundType = '2D', backgroundImage} = config;
        this.dom = dom;
        this.callback = callback;
        this.backgroundType = backgroundType;
        this.backgroundImage = backgroundImage
    }

    /**
     * 设置参会人
     * @param users
     */
    public set users(users: IUser[]) {
        this.$users = users;
        if (!this.loaded && users.length !== 0) {
            this.callback('loading');
            this.init();
            this.loaded = true;
        }
        if (users.length === 0) {
            this.callback('not user');
        }
    }

    protected initRender() {
        if (this.backgroundType === '3D') {
        } else {
            this.dom.style.backgroundImage = `url(${this.backgroundImage})`;
        }
        this.camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 20, 10000);
        this.camera.position.z = 3000;
        this.renderer = new WebGLRenderer({alpha: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.left = '0px';
        this.dom.appendChild(this.renderer.domElement);
    }

    protected static clampToMaxSize(image, maxSize: number) {
        if (image.width > maxSize || image.height > maxSize) {
            const scale = maxSize / Math.max(image.width, image.height);
            // @ts-ignore
            const canvas: HTMLCanvasElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            canvas.width = Math.floor(image.width * scale);
            canvas.height = Math.floor(image.height * scale);
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            return canvas
        }

        return image
    }

    protected getTexture(url: string): Promise<Texture> {
        return new Promise(async (res) => {
            try {
                // url = saveImage.cache(url)
            } catch (e) {
            }

            let textTure;

            // 第一种方式获取
            textTure = new TextureLoader().load(url, (texture) => {
                    textTure.image = Base.clampToMaxSize(texture.image, 128);
                    res(textTure)
                }, () => {
                }, () => {
                    console.log('图片【' + url + '】下载错误');
                    res(textTure)
                }
            )
        })
    }

    protected abstract init();

}

export default Base