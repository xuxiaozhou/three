import Barrage from '../packages/barrage';

// @ts-ignore
window.barrage = new Barrage({
  container: document.getElementById('webgl'),
  type: "scroll"
});

const text = {
  content: '李四：你好呀 🤘🏻111',
  avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
};

const image = {
  type: 'image',
  image: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
  avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
};

// @ts-ignore
window.add = () => {
  let count = 0;

  // @ts-ignore
  window.timer = setInterval(async () => {
    const content = parseInt(Math.random() * 10 + '') % 2 === 0 ? text : image;
    // @ts-ignore
    await window.barrage.add(content);
    count += 1;
    if (count > 100) {
      // @ts-ignore
      clearInterval(window.timer);
    }
  }, 1000);
};
