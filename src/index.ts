
import Sign3D from "./lib/Sign3D";

// @ts-ignore
const sign3d = window.sign3d = new Sign3D({
    dom: document.getElementById('webgl'),
    backgroundImage: 'http://img.eventist.cn/hudong/threeBg.jpg',
    backgroundType: '2D',
    shape: 'Circle',
    openAnimates: ['Sphere', 'Artascope', 'Grid', 'Helix'],
    // openAnimates: ['Sphere', 'Artascope', 'Grid', 'Helix', 'Logo'],
    callback: (status) => {
        console.log(status)
    }
});

sign3d.users = [
    {
        openid: 11,
        avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
        name: '答案'
    }
];