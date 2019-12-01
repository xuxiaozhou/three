import Sign3d from '../lib/Sign3d'

window.onload = () => {
  new Sign3d({
    backgroundImage: 'http://img.eventist.cn/hudong/threeBg.jpg',
    backgroundType: '2d',
    dom: document.getElementById('webgl'),
    rotationSpeed: 2,
    shineColor: '#FCECB7',
    animateSpendTime: 10,
    tableData: [],
    openAnimates: ['Sphere', 'Artascope', 'Grid', 'Helix'],
    users: [
      {
        id: 1,
        avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
        name: '答案'
      }
    ]
  }).init()
}