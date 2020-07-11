import {IGlobalConfig} from "../interface";
import Sprite from "../Sprite";

const employTrackSpaceY = 20;

class TrackManager {
  private globalConfig: IGlobalConfig;

  public constructor(globalConfig: IGlobalConfig) {
    this.globalConfig = globalConfig;
  }

  // 占用的轨道
  private employTrack: { [spriteId: string]: string } = {};

  private getCanUseTrack(employTrack, allTrack, height): [number, number] | null {
    const spaceTracks = [];

    if (employTrack.length !== 0) {
      const useTrack = employTrack
        .map(range => (
          range.split(',').map(value => parseFloat(value))
        ))
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
      if (spaceTrack[1] - spaceTrack[0] > height + employTrackSpaceY) {
        return [spaceTrack[0], spaceTrack[0] + height + employTrackSpaceY];
      }
    }

    return null;
  }

  // 申请轨道
  public applyPosition(sprite: Sprite): null | number {
    const employ = Object.values(this.employTrack);
    const [, height] = sprite.size;

    const employTrackPosition: [number, number] | null = this.getCanUseTrack(
      employ,
      this.globalConfig.trackRange,
      height,
    );

    if (!employTrackPosition) {
      return null;
    }

    this.employTrack[sprite.id] = employTrackPosition.toString();
    sprite.employTrack = true;
    return employTrackPosition[0];
  }

  // 删除占用轨道
  public removeEmployWithNotEmploy(sprite: Sprite) {
    if (!sprite.employTrack && this.employTrack[sprite.id]) {
      delete this.employTrack[sprite.id];
    }
  }
}

export default TrackManager;
