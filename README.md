# 互动three

## 安装
```
npm install hudong-three
yarn add hudong-three
```

## 弹幕
```javascript
import {Barrage} from 'hudong-three';

// 初始化
const barrage = new Barrage(
  document.getElementById('webgl'),
  // 全局配置
  {
    type: "scroll"
  }
);
// 开启，默认是开启
barrage.start();
// 暂停
barrage.stop();
// 销毁弹幕应用
barrage.destroy();
// 新增弹幕
barrage.add({
    content: '李四：你好呀 🤘🏻111',
    avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
})
```

### 弹幕配置项
#### globalConfig 全局配置

```javascript
{

}
```

#### 新增弹幕配置

```javascript
{

}
```

## 手绘板
```javascript
import {Draw} from 'hudong-three';
// 纯展示
const w2 = new Draw({
  container: document.getElementById('webgl2'),
  type: 'show'
});

// 可手写
new Draw({
  container: document.getElementById('webgl1'),
  onSync(action) {
    w2.action(action);
  }
});
```

## todo list
- [ ] rollup.js 生成对应文件的类型定义
- [ ] 3d抽奖
- [ ] 3d签到墙
- [ ] 签字
    - [ ] 上一步，下一步
    - [ ] 设置样式
- [ ] demo 案例
- [ ] docs 文档

## 参考
```
http://www.yanhuangxueyuan.com/WebGL/
http://www.webgl3d.cn/threejs/docs/
```
