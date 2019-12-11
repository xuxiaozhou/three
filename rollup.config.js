import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import pkg from './package.json'

export default [
  {
    input: 'src/lib/index.ts',
    external: ['lodash', 'three', '@tweenjs/tween.js'],
    output: [
      { file: pkg.main, format: 'cjs' }
    ],
    plugins: [
      commonjs({
        namedExports: {
          './src/lib/postprocessing': [
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
      typescript() // so Rollup can convert TypeScript to JavaScript
    ]
  },
  {
    input: 'src/lib/ImageManager/index.ts',
    external: ['store', 'fs-extra', 'path', 'electron', 'request'],
    output: [
      {
        file: 'dist/imageManager.js',
        format: 'umd',
        name: 'imageManage'
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript()
    ]
  }
]