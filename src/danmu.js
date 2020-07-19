import Barrage from '../packages/Barrage';

window.barrage = new Barrage(
  document.getElementById('webgl'),
  {
    type: "scroll"
  }
);
let count = 0;

const text = {
  content: '李四：你好呀 🤘🏻111',
  avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
};
const image = {
  type: 'image',
  image: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
  avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
};

window.add = () => {
  window.timer = setInterval(async () => {
    const content = parseInt(Math.random() * 10 + '') % 2 === 0 ? text : image;
    await window.barrage.add(content);
    count += 1;
    if (count > 100) {
      clearInterval(window.timer);
    }
  }, 100);
};
