
const config = {
  presets: ['./tools/es2015-preset.js', 'react'],
  plugins: ['transform-class-properties', 'transform-object-rest-spread']
}

if (process.env === 'production') {
  config.plugins.concat(['transform-react-remove-prop-types'])
}

module.exports = config