import { Camera, Group } from "three";

export interface IShowOption {
  type: 'variate' | 'text',
  value: string | number
}

export interface IConfig {
  dom: HTMLElement,
  backgroundImage: string,
  backgroundType: '2D' | '3D',
  callback: (status: string) => void,
  getPaichuConfig?: () => boolean,
  shape?: 'Circle' | 'Round',
  openAnimates?: string[],
  animateSpendTime?: number,
  showOption?: IShowOption[],
  tableData?: any[],
  shineColor?: string,
  cache?: (img: string) => string,
  minCount?: number,
  filleStyle?: string,
  bgColor?: string | undefined,
  fontSize?: string
}

export interface IOption {
  counter: number,
  group: Group,
  camera: Camera,
  rotationSpeed?: number,
  objs?: any,
  tableData?: any[],
  shape?: 'Circle' | 'Round'
}

export interface IUser {
  openid: string | number,
  avatar: string,
  name: string
}

export interface IPosition {
  x: number,
  y: number,
  z: number
}

export interface ITurnInfo {
  image: string | false,
  text: string
}
