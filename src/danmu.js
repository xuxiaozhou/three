import Barrage from '../packages/Barrage';

window.barrage = new Barrage(document.getElementById('webgl'));

window.add = () => {
  window.barrage.add({
    content: '李四：你好呀 🤘🏻111',
    avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
  });
};
