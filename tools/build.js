const fs = require('fs')
const execSync = require('child_process').execSync
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv)
  })

console.log('Building CommonJS modules ...')

exec('babel modules -d .', {
  BABEL_ENV: 'cjs'
})

console.log('\nBuilding ES modules ...')

exec('babel modules -d es', {
  BABEL_ENV: 'es'
})

console.log('\nBuilding react-form.js ...')

exec('rollup -c -i modules/index.js -o umd/react-form.js', {
  BABEL_ENV: 'es',
  NODE_ENV: 'development'
})

console.log('\nBuilding react-form.min.js ...')

exec('rollup -c -i modules/index.js -o umd/react-form.min.js', {
  BABEL_ENV: 'es',
  NODE_ENV: 'production'
})

const size = gzipSize.sync(
  fs.readFileSync('umd/react-form.min.js')
)

console.log('\ngzipped, the UMD build is %s', prettyBytes(size))
