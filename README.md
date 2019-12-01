# three


## Sign3D
```javascript
import {Sign3D} from 'hudong-three'

const sign3D = new Sign3D({
    // 每个动画效果展示时间，默认值 10s
    animateSpendTime: 10,
    // 监听事件
    callback: ({status,message})=>{
      // 监听里面冒泡出来的信息
    },
    // webgl 容器
    dom: document.getElementById('webgl'),
    // 背景图片
    backgroundImage: 'xx.png',
    // 背景图片效果 2D，3D , 默认3D   
    backgroundType: '3D',
    // 辉光颜色
    shineColor: '#FCECB7',
    // 打开的动画效果 
    openAnimates: ['Sphere','Artascope', 'Grid','Helix','Logo'],
    // 头像形状 Circle Round
    shape: 'Circle',
    // 图片管理器   
    imageManager: {
      cache(url){
        return url
      }   
    } 
})

// 初始化参会人
sign3D.users = [
  {
    openid:'',
    avatar: '',
    name: ''
  }
]
// 添加参会人
sign3D.addUser({
    openid:'',
    avatar: '',
    name: ''
})
// 清除定时器
sign3D.destory()
```

```