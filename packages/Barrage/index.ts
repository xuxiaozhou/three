import Scene from "./Scene";
import Sprite from "./Sprite";

// 如何保证不同字号的弹幕不碰撞
// 弹幕的位置计算
// 弹幕的速度控制及动画实现
// 弹幕与视频的同步

// 跑道
// 塔台
// 飞机

class Barrage {
  private scene: Scene;

  // 弹幕
  // private danmus = [];
  // 弹幕实例
  // private instances = {};

  constructor(container: HTMLElement) {
    // 创建场景
    this.scene = new Scene({
      container
    });
  }

  public add() {
    const text = '李四：你好呀 🤘🏻111';
    this.scene.add(
      new Sprite({
        texture: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
        text,
      })
    );
    // const danmu: IDanmu = {
    //   id: Math.random(),
    //   nickname: '李四',
    //   avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
    //   content: '你好呀 🤘🏻',
    //   fontSize: 24
    // };
    // this.danmus.push(danmu);
    // this.instances[danmu.id] = generate(danmu);
    // this.layer.append(this.instances[danmu.id]);
  }
}

export default Barrage
