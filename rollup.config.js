import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

const generateConfig = (entry, outputName) => ({
  input: `packages/${entry}`,
  external: Object.keys(pkg.dependencies),
  output: [
    {
      file: `dist/${outputName}.js`,
      format: 'cjs'
    },
    {
      file: `dist/${outputName}.umd.js`,
      format: 'umd',
      name: outputName
    },
  ],
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript()
  ]
});

export default [
  // {
  //   input: 'packages/index.ts',
  //   external,
  //   output: [
  //     { file: pkg.main, format: 'cjs' }
  //   ],
  //   plugins: [
  //     commonjs({
  //       namedExports: {
  //         './packages/utils/postprocessing': [
  //           'EffectComposer', 'RenderPass',
  //           'GodRaysPass', 'KernelSize',
  //           'ClearMaskPass',
  //           'ShaderPass',
  //           'MaskPass',
  //           'ToneMappingPass',
  //           'CopyMaterial',
  //         ]
  //       }
  //     }),
  //     nodeResolve(),
  //     typescript()
  //   ]
  // },
  generateConfig('Barrage/index.ts', 'Barrage'),
  generateConfig('Draw/index.ts', 'Draw'),
  generateConfig('3d/Sign3d.ts', 'Sign3d'),
];
