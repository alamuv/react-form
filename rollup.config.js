import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

var config = {
  format: 'umd',
  moduleName: 'ReactForm',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
    resolve(),
    commonjs({
      namedExports: {
        'node_modules/ramda/index.js': ['ramda']
      }
    })
  ],
  external: ['react', 'prop-types', 'classnames'],
  globals: {
    react: 'React',
    'prop-types': 'PropTypes',
    classnames: 'classnames'
  }
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}

export default config
