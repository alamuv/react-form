import test from 'ava'
import * as namespace from '../../modules'
import Form from '../../modules/Form'

test('exports Form', t => {
  t.is(namespace.Form, Form)
})
