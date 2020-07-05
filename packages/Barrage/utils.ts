import {employTrackSpaceY} from "./constant";

export const loadingImage = (src): Promise<CanvasImageSource> => {
  return new Promise(resolve => {
    const image = new Image();
    image.crossOrigin = '';
    image.src = src;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      resolve(null)
    }
  })
};

export const createCanvas = (id: string, containerWidth: number, containerHeight: number): HTMLCanvasElement => {
  const element = window.document.createElement('canvas');
  element.id = id;
  element.style.position = 'absolute';
  element.style.display = 'block';
  element.width = containerWidth;
  element.height = containerHeight;

  return element;
};

export const getRandomColor = (): string => (
  'rgb(' + parseInt(String(Math.random() * 255)) + ','
  + parseInt(String(Math.random() * 255)) + ','
  + parseInt(String(Math.random() * 255)) + ')'
);

export const mixConfig = (config, defaultConfig) => {
  Object.keys(defaultConfig).forEach(key => {
    if (typeof config[key] === 'undefined') {
      config[key] = defaultConfig[key];
    }
  });

  return config;
};

export function getCanUseTrack(employTrack, allTrack, height): [number, number] | null {
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
