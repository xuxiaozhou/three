import typescript from 'rollup-plugin-typescript'
import pkg from './package.json'

export default [
  {
    input: 'src/lib/index.ts',
    external: ['lodash', 'three', '@tweenjs/tween.js', 'three-text2d-2'],
    output: [
      {file: pkg.main, format: 'cjs'},
      {file: pkg.module, format: 'es'}
    ],
    plugins: [
      typescript() // so Rollup can convert TypeScript to JavaScript
    ]
  }
]