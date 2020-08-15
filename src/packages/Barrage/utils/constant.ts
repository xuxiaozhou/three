import {IGlobalConfig, ISpriteConfig} from "../interface";

export const screenSpace = 32;

export const imageAndTextSpace = 12;

export const defaultGlobalConfig: IGlobalConfig = {
  type: 'scroll',
  lifeTime: 200,
};

export const defaultSpriteConfig: ISpriteConfig = {
  fontSize: 36,
  fontFamily: 'Microsoft YaHei',
  avatarSize: 50,
  type: 'text',
  padding: [12, 12, 12, 12],
  radius: 20,
  imageSize: 80,
};
