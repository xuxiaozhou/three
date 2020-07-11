import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

const generateConfig = (entry, outputName) => ({
  input: `packages/${entry}`,
  external: Object.keys(pkg.dependencies),
  output: [
    {
      file: `lib/${outputName}.js`,
      format: 'cjs'
    }
  ],
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript()
  ]
});

const map = {
  Draw: 'Draw/index.ts',
  Lottery3d: 'Lottery3d/index.ts',
  Sign3D: 'Sign3D/index.ts',
  Barrage: 'Barrage/index.ts',
  request: 'utils/request.ts',
  socket: 'utils/socket.ts',
  hudong: 'index.ts',
};

export default Object.keys(map).reduce((arr, key) => ([
  ...arr,
  generateConfig(map[key], key),
]), []);
