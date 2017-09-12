import test from 'ava'
import Field from '../../modules/Field.js'

test('Field\'s render calls children correctly', (t) => {
  const props = {
    children: (shape) => {
      t.truthy(shape.hasOwnProperty('getInputProps'), 'It has a getInputProps value')
      t.truthy(shape.hasOwnProperty('getInputValues'), 'It has an getInputValues value')
      t.truthy(shape.hasOwnProperty('error'), 'It has an error value')
    }
  }

  const inst = new Field(props)

  inst.render()
})
