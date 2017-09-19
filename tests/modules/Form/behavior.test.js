import React from 'react'
import { mount } from 'enzyme'
import test from 'ava'
import sinon from 'sinon'
import browserEnv from 'browser-env'

import Form from '../../../modules/Form'

browserEnv()

test('Form supplies correct input props in render', t => {
  const config = {
    email: {},
    password: {}
  }

  const wrapper = mount(<Form config={config} render={(fields) => (
    <input {...fields.email.inputProps} />
  )} />)

  const inputProps = wrapper.find('input').props()

  t.is(inputProps.id, 'email')
  t.is(inputProps.value, '')
})

test('Form supplies values if initialized', t => {
  const config = {
    email: {
      value: 'test@test.com'
    },
    password: {}
  }

  const wrapper = mount(<Form config={config} render={(fields) => (
    <input {...fields.email.inputProps} />
  )} />)

  const inputProps = wrapper.find('input').props()

  t.is(inputProps.id, 'email')
  t.is(inputProps.value, 'test@test.com')
})

test('Calling input on change updates form state', t => {
  const onChangeSpy = sinon.spy()

  const config = {
    email: {},
    password: {}
  }

  const wrapper = mount(<Form onChange={onChangeSpy} config={config} render={(fields) => (
    <input {...fields.email.inputProps} />
  )} />)

  wrapper.find('input').simulate('change', {
    target: {
      value: 'hey'
    }
  })

  t.truthy(onChangeSpy.calledWith({
    formValues: { email: 'hey' },
    formErrors: {}
  }))
})

test('Errors are applied correctly', t => {
  const config = {
    someField: {
      validateOn: ['change'],
      validateWith: [
        input => (input === 'squirrel' ? '' : 'Not a squirrel!!!')
      ]
    },
    password: {}
  }

  const wrapper = mount(<Form config={config} render={(fields) => (
    <input {...fields.someField.inputProps} />
  )} />)

  wrapper.find('input').simulate('change', {
    target: {
      value: 'hey'
    }
  })

  const formState = wrapper.state()

  t.is(formState.formErrors.someField, 'Not a squirrel!!!')
})
