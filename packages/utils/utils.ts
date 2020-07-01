export function creatId(pre: string = '') {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  function guid() {
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
  }

  return pre + guid()
}

export function wait(time: number = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
