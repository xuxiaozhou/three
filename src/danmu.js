// import { Danmu } from '../packages';
//
// const danmu = new Danmu(document.getElementById('webgl'));
//
// setTimeout(() => {
//   danmu.send({
//     id: parseInt(Math.random() * 2012387341255).toString(),
//     avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
//     text: '你好呀',
//     nickname: '许晓周 🤘🏻',
//     font: 'normal bold ' + 3 + 'em 微软雅黑'
//   });
// }, 1000);

import Barrage from '../packages/Barrage';

window.barrage = new Barrage(document.getElementById('webgl'));
