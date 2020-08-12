import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import pkg from './package.json'

export default [
  {
    input: 'src/package/index.ts',
    external: ['lodash', 'three', '@tweenjs/tween.js'],
    output: [
      { file: pkg.main, format: 'cjs' }
    ],
    plugins: [
      commonjs({
        namedExports: {
          './src/package/utils/postprocessing': [
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
  }
]
