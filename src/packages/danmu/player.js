'use strict'

let CommentFrame = require('./commentframe')
/**
 * 弹幕播放器
 * @constructor
 * @param {Integer} insertElement
 * @param {DOMElement} danmuConfig
 */
class Player {
  constructor (insertElement, danmuConfig) {
    this.insertElement = null
    // 绘制canvas相关的组件
    this.canvas = null
    this.frame = null
    // 存放解析好的弹幕内容
    this.danmus = []
    this.config = danmuConfig
  }

  /**
     * 初始化方法
     */
  setup (insertObject, elementId) {
    this.insertElement = insertObject
    let w = this.insertElement.offsetWidth // 控件的宽
    let h = this.insertElement.offsetHeight // 控件的高
    this.canvas = this.addCanvasElement(elementId, w, h)
    this.insertElement.parentNode.insertBefore(this.canvas, this.insertElement)
    let canvasContext = this.canvas.getContext('2d')
    this.frame = new CommentFrame(w, h, canvasContext)
  }

  /**
     * 控制弹幕
     * @param action
     */
  controlDanmu (action) {
    if (action === 'play') {
      this.frame.begin()
    } else if (action === 'stop') {
      this.frame.stop()
      this.frame.clearDanmu()
      this.frame.render()
    } else if (action === 'update') {
      this.addDanmu()
    }
  }

  /**
     * 创建canvas元素
     */
  addCanvasElement (elementId, width, height) {
    let e = window.document.createElement('canvas')
    e.id = elementId
    e.style.position = 'absolute'
    e.style.display = 'block'
    e.width = width
    e.height = height
    return e
  }

  /**
     * 将从服务器取得所有弹幕的内容，进行解析，放入this.danmus
     */
  parseDanmus (jsonResp) {
    let nowTime = (new Date()).valueOf()

    this.danmus = []
    jsonResp.forEach(danmu => {
      danmu.font = danmu.textStyle
      danmu.lifeTime4TimeStamp = danmu.lifeTime * 1000 / 60
      danmu.addTime = nowTime
      danmu.height = parseInt(danmu.height)
      danmu.lifeTime = parseInt(danmu.lifeTime)
      this.danmus.push(danmu)
    })
  }

  /**
     * 弹幕精灵添加
     */
  addDanmu () {
    this.danmus.forEach(info => {
      if (info.style === 'custom') {
        this.frame.addCustomSprite(info)
      } else {
        this.frame.addSprite(info)
      }
    })
  }

  /**
     * 弹幕精灵删除
     */
  deleteDanmus (ids) {
    this.frame.deleteSprites(ids)
  }

  /**
     * 显示/隐藏弹幕的处理函数
     */
  toggleDanmu () {
    if (this.frame.visible) { // 弹幕可见
      this.frame.clearDanmu() // 情况当前所有待渲染弹幕
      this.frame.render() // 重绘一帧空的屏幕
      this.frame.stop() // 停止Frame
      this.frame.visible = false // 设置弹幕标记为不可见
    } else { // 弹幕隐藏
      this.frame.begin()
      this.frame.visible = true
    }
  }
}
module.exports = Player
