interface IConfig {
  container: HTMLElement
}

class Sign3D {
  constructor(config: IConfig) {
    const {container} = config;
    console.log(container);
  }
}

export default Sign3D
