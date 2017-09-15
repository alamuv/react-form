import test from 'ava'
import { runAllValidations } from '../../../modules/utils.js'

test('runAllValidations returns first error found', t => {
  const validateWith = [
    input => input === 'hey' ? 'error!!!' : '',
    input => input === 'ya' ? 'error!!!' : ''
  ]

  const response = runAllValidations('ya', validateWith)

  t.is(response, 'error!!!')
})
