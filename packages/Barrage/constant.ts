import {IGlobalConfig, ISprite} from "./interface";

export const defaultSpriteConfig: ISprite = {
  fontSize: 36,
  fontColor: '#fff',
  fontFamily: 'Microsoft YaHei',
  avatarSize: 50,
  type: 'text',
  padding: [12, 12, 12, 12],
  radius: 20,
};

export const defaultGlobalConfig: IGlobalConfig = {
  type: 'scroll',
  lifeTime: 200,
};

export const imageAndTextSpace = 12;

export const screenSpace = 32;

export const employTrackSpaceX = 20;
export const employTrackSpaceY = 20;
