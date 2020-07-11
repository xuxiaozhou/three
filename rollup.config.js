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
    },
    {
      file: `lib/${outputName}.umd.js`,
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
  generateConfig('index.ts', 'hudong'),
];
