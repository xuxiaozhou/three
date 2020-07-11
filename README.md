# 互动three

## rollup.js
- [ ] 生成定义文件

## 功能
- 3d抽奖
- 3d签到墙
- 手绘板

## 弹幕
```javascript
import {Barrage} from 'hudong-three';

const barrage = new Barrage(
  document.getElementById('webgl'),
  {
    type: "scroll"
  }
);
barrage.start();
barrage.stop();
barrage.destroy();
barrage.add({
    content: '李四：你好呀 🤘🏻111',
    avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
})
```
