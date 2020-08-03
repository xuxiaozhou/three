import {Camera, Group} from "three";

export type IAnimate = 'Sphere' | 'Logo' | 'Artascope' | 'Grid' | 'Helix'

export interface IConfig {
  container?: HTMLElement,
  shape?: 'Circle' | 'Round',
  backgroundImage?: string,
  backgroundType?: '2D' | '3D',
  animates?: IAnimate[],
}

export interface IOptions {
  Cont: number,
  group: Group,
  camera: Camera,
}
