import {Lottery3d} from "./packages";

function init() {
  // @ts-ignore
  const lottery3d = window.lottery3d = new Lottery3d({
    backgroundImage: 'http://img.eventist.cn/hudong/threeBg.jpg',
    backgroundType: '2D',
    dom: document.getElementById('webgl'),
    animateSpendTime: 10,
    shape: 'Circle',
    callback: (status, ...args) => {
      console.log(status, args)
    },
    getPaichuConfig: () => true
  });
  const users = []
  Array.from(new Array(2)).forEach((_, i) => {
    users.push({
      openid: i,
      avatar: i % 2 === 0 ? 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132' : 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2187162754,2147384057&fm=15&gp=0.jpg',
      name: '答案' + i
    })
  })
  lottery3d.users = users
}

// @ts-ignore
window.init = init
init()
