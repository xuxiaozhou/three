'use strict';

var three = require('three');

class Sign3D {
    constructor(config) {
        this.render = () => {
            this.timer = window.requestAnimationFrame(this.render);
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
            this.renderer.render(this.scene, this.camera);
        };
        this.resize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.render(this.scene, this.camera);
        };
        this.config = config;
        this.prepareRender();
        this.add();
        this.render();
        window.addEventListener('resize', this.resize);
    }
    destroy() {
        if (this.timer) {
            window.cancelAnimationFrame(this.timer);
        }
        window.removeEventListener('resize', this.resize);
    }
    add() {
        const geometry = new three.BoxGeometry();
        const material = new three.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new three.Mesh(geometry, material);
        this.scene.add(this.cube);
    }
    prepareRender() {
        this.config.container.style.backgroundImage = `url(${this.config.backgroundImage})`;
        // 场景
        this.scene = new three.Scene();
        // 摄像机
        this.camera = new three.PerspectiveCamera(40, 
        // 窗口宽高比
        window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 30;
        // 渲染器
        this.renderer = new three.WebGLRenderer({ alpha: true });
        this.renderer.domElement.style.display = 'block';
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.config.container.appendChild(this.renderer.domElement);
    }
}

module.exports = Sign3D;
