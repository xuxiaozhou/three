import {IGlobalConfig} from "../interface";
import Sprite from "./Sprite";

const employTrackSpaceY = 20;

interface IEmployTrack {
  position: [number, number],
  sprite: Sprite,
}

class TrackManager {
  private readonly globalConfig: IGlobalConfig;

  public constructor(globalConfig: IGlobalConfig) {
    this.globalConfig = globalConfig;
  }

  // 占用的轨道
  private employTrack: { [spriteId: string]: IEmployTrack } = {};

  private getCanUseTrack(needAddSprite: Sprite): [number, number] | null {
    const {trackRange} = this.globalConfig;
    const needAddSpriteHeight = needAddSprite.height;

    if (Object.keys(this.employTrack).length === 0) {
      return [trackRange[0], needAddSpriteHeight];
    }

    const allTrack = this.globalConfig.trackRange;

    const spaceTracks = [];

    const employTrack = Object.values(this.employTrack);

    if (employTrack.length !== 0) {
      const useTrack = employTrack
        .map(range => (range.position))
        .sort((a, b) => (
          a[0] > b[0] ? 1 : -1
        ));

      const tracks = [];
      useTrack.forEach((track, index) => {
        if (index === 0) {
          tracks.push(track);
          return;
        }

        const prevTrack = tracks[tracks.length - 1];
        const [min, max] = track;
        if (prevTrack[1] + employTrackSpaceY > min) {
          prevTrack[1] = max;
          return
        }

        tracks.push(track);
      });

      const [start] = tracks[0];
      const [, end] = tracks[tracks.length - 1];

      if (allTrack[0] < start) {
        spaceTracks.push([allTrack[0], start]);
      }

      if (allTrack[1] > end) {
        spaceTracks.push([end, allTrack[1]]);
      }

      if (tracks.length > 1) {
        let startTrack;
        tracks.forEach(track => {
          if (startTrack === undefined) {
            startTrack = track[1];
          } else {
            spaceTracks.push([startTrack, track[0]]);
            startTrack = track[0];
          }
        });
      }
    } else {
      spaceTracks.push([...allTrack])
    }

    for (let i = 0; i < spaceTracks.length; i += 1) {
      const spaceTrack = spaceTracks[i];
      if (spaceTrack[1] - spaceTrack[0] > needAddSpriteHeight + employTrackSpaceY) {
        return [spaceTrack[0], spaceTrack[0] + needAddSpriteHeight + employTrackSpaceY];
      }
    }

    return null;
  }

  // 申请轨道
  public applyPosition(sprite: Sprite): null | number {
    const employTrackPosition: [number, number] | null = this.getCanUseTrack(sprite);

    if (!employTrackPosition) {
      return null;
    }

    this.employTrack[sprite.id] = {
      position: employTrackPosition,
      sprite,
    };

    return employTrackPosition[0];
  }

  // 删除占用轨道
  // private removeEmployWithNotEmploy(sprite: Sprite) {
  //   if (!sprite.employTrack && this.employTrack[sprite.id]) {
  //     delete this.employTrack[sprite.id];
  //   }
  // }
}

export default TrackManager;
