'use strict';

const Player = require('./player');
const player = new Player();

function send(param) {
  player.parseDanmus([param]);
  player.controlDanmu('update');
}

function init(config, object) {
  window.config = config;
  player.setup(object, 'canvas-danmu');
  player.controlDanmu('play');
  window.console.log('弹幕初始化完成！');
}

module.exports = {
  init: init,
  send: send,
  example() {
    let i = 1;
    let id = 10000;
    setInterval(function () {
      send({
        text: '[IMG WIDTH=24]danmu-24.png[/IMG]测试[IMG WIDTH=24]danmu-24.png[/IMG]Hello World[IMG WIDTH=24]danmu-24.png[/IMG]',
        color: 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')',
        lifeTime: 500,
        textStyle: 'normal bold ' + i + 'em 微软雅黑',
        height: i * 10,
        id: id
      });
      i++;
      if (i > 5) {
        i = 1;
      }
    }, 10);
  },
  resize(object) {
    let w = object.offsetWidth; // 控件的宽
    let h = object.offsetHeight; // 控件的高

    player.frame.resize(w, h);
    player.canvas.width = w;
    player.canvas.height = h;
  },
  stop() {
    player.frame.stopDanmu();
  },
  start() {
    player.frame.restartDanmu();
  },
  clear() {
    player.frame.clearDanmu();
  }
};

// 给window添加私货方便调试
window.danmuControl = module.exports;
