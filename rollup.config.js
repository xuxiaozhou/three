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
      typescript()
    ]
  },
  {
    input: 'src/lib/ws.ts',
    output: [
      { file: 'dist/ws.js', format: 'cjs' }
    ],
    plugins: [
      commonjs(),
      nodeResolve(),
      typescript()
    ]
  }
]