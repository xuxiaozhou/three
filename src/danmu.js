import Barrage from '../packages/Barrage';

window.barrage = new Barrage(
  document.getElementById('webgl'),
  {
    type: "scroll"
  }
);
let count = 0;

window.add = () => {
  window.timer = setInterval(() => {
    window.barrage.add({
      content: '李四：你好呀 🤘🏻111',
      avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
    });
    count += 1;
    if (count > 500) {
      clearInterval(window.time);
    }
  }, 100);
};
