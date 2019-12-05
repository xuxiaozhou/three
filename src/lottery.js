import Lottery3d from '../lib/Lottery3d'

window.onload = () => {
  const callback = () => {
  }
  const lottery3d = window.lottery3d = new Lottery3d({
    backgroundImage: 'http://img.eventist.cn/hudong/threeBg.jpg',
    backgroundType: '2D',
    dom: document.getElementById('webgl'),
    rotationSpeed: 2,
    shineColor: '#FCECB7',
    animateSpendTime: 10,
    callback
  })

  lottery3d.users = [
    {
      openid: 11,
      avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
      name: '答案'
    }
  ]
}