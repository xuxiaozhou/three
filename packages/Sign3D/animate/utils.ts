// 生成从minNum到maxNum的随机数
export function randomNum(...args) {
  const [minNum, maxNum] = args;
  if (args.length === 1) {
    return parseInt(String(Math.random() * minNum + 1), 10);
  }

  if (args.length === 2) {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
  }

  return 0;
}
