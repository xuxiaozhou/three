import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

const external = Object.keys(pkg.dependencies);

const generate = (entry, outputName) => ({
  input: `packages/${entry}`,
  external,
  output: [
    {
      file: `dist/${outputName}.js`,
      format: 'cjs'
    }
  ],
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript()
  ]
});

export default [
  {
    input: 'packages/index.ts',
    external,
    output: [
      { file: pkg.main, format: 'cjs' }
    ],
    plugins: [
      commonjs({
        namedExports: {
          './packages/utils/postprocessing': [
            'EffectComposer', 'RenderPass',
            'GodRaysPass', 'KernelSize',
            'ClearMaskPass',
            'ShaderPass',
            'MaskPass',
            'ToneMappingPass',
            'CopyMaterial',
          ]
        }
      }),
      nodeResolve(),
      typescript()
    ]
  },
  generate('Barrage/index.ts', 'Barrage'),
];
