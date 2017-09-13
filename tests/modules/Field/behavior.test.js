import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import Field from '../../../modules/Field.js'

test('Field can render a React component', t => {
  t.notThrows(
    () => shallow(<Field render={() => <div>Hello!</div>} />),
    'Does not throw an error when rendering an el'
  )
})
