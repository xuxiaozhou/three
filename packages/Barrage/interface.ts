export interface IFontStyle {
  // 内容颜色
  fontColor?: string
  // 字体
  fontFamily?: string
  // 字体大小
  fontSize?: number
}

export interface IDanmu extends IFontStyle {
  // 弹幕id
  id: string | number,
  // 弹幕人头像
  avatar: string,
  // 弹幕人名字
  nickname: string,
  // 弹幕内容
  content?: string,
  // 图片
  image?: string,
}

export interface ISpriteStyle extends IFontStyle {
  height?: number
  width?: number,
}
