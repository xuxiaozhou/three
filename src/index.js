import Sign3d from '../lib/Sign3d'

window.onload = () => {
  const callback = () => {
  }
  const sign3d = window.sign3d = new Sign3d({
    backgroundImage: 'http://img.eventist.cn/hudong/threeBg.jpg',
    backgroundType: '3D',
    dom: document.getElementById('webgl'),
    rotationSpeed: 2,
    shineColor: '#FCECB7',
    animateSpendTime: 10,
    tableData: [],
    openAnimates: [
      'Sphere',
      'Artascope',
      'Grid',
      'Helix',
      'Logo'
    ],
    callback
  })

  sign3d.users = [
    {
      openid: 11,
      avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
      name: '答案'
    }
  ]
}