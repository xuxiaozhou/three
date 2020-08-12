import {Camera, Group} from "three";

export interface ISign3dConfig {
  backgroundImage: string,
  container: HTMLElement,
  backgroundType?: '2D' | '3D'
}

export interface IAnimateOptions {
  Cont: number,
  group: Group,
  camera: Camera,
  rotationSpeed?: number,
  tableData?: Array<[number, number]>
}
