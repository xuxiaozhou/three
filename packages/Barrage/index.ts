import Scene from "./Scene";
import Sprite from "./Sprite";
import {IDanmu, IGlobalConfig} from "./interface";

// 如何保证不同字号的弹幕不碰撞
// 弹幕的位置计算
// 弹幕的速度控制及动画实现
// 弹幕与视频的同步

// 跑道
// 塔台
// 飞机

class Barrage {
  private readonly scene: Scene;
  public stop: () => void;
  public start: () => void;
  public clear: () => void;

  public constructor(container: HTMLElement, globalConfig: IGlobalConfig = {}) {
    // 创建场景
    this.scene = new Scene(container, globalConfig);

    this.stop = this.scene.stop.bind(this.scene);
    this.start = this.scene.start.bind(this.scene);
    this.clear = this.scene.clear.bind(this.scene);
  }

  public add({content, avatar}: IDanmu) {
    this.scene.add(
      new Sprite({
        avatar,
        content,
      })
    );
  }
}

export default Barrage
