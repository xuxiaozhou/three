import { Lottery3d } from "./lib";

// @ts-ignore
const lottery3d = window.lottery3d = new Lottery3d({
  backgroundImage: 'http://img.eventist.cn/hudong/threeBg.jpg',
  backgroundType: '2D',
  dom: document.getElementById('webgl'),
  animateSpendTime: 10,
  shape: 'Circle',
  callback: (status, ...args) => {
    console.log(status, args)
  }
});

lottery3d.users = [
  {
    openid: 11,
    avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
    name: '答案'
  },
  {
    openid: 22,
    avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
    name: '答1案'
  },
  {
    openid: 33,
    avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
    name: '答2案'
  },
  {
    openid: 44,
    avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
    name: '答3案'
  },
  {
    openid: 55,
    avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
    name: '答4案'
  },
];
