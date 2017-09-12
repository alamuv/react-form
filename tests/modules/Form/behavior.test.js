import React from 'react'
import test from 'ava'
import browserEnv from 'browser-env'
import { mount } from 'enzyme'
import sinon from 'sinon'
import Form from '../../../modules/Form.js'
import Field from '../../../modules/Field.js'

browserEnv()

test('Form gives props to child if Field', t => {
  const wrapper = mount(
    <Form >
      <Field name='test' />
    </Form>
  )

  const fieldProps = wrapper.find(Field).props()

  t.is(fieldProps.name, 'test')
  t.truthy(fieldProps.updateFormValue)
  t.truthy(fieldProps.updateFormError)
  t.is(fieldProps.value, '')
  t.is(fieldProps.error, '')
})

test('Form validate and validateOn are passed', t => {
  const formProps = {
    validate: () => 'error',
    validateOn: 'onSubmit'
  }

  const wrapper = mount(
    <Form {...formProps}>
      <Field name='test' />
    </Form>
  )

  const fieldProps = wrapper.find(Field).props()

  t.is(fieldProps.validate, formProps.validate)
  t.is(fieldProps.validateOn, formProps.validateOn)
})

test('Field validate and validateOn trumps form', t => {
  const formProps = {
    validate: () => 'error',
    validateOn: 'onSubmit'
  }

  const fieldProps = {
    name: 'test',
    validate: () => 'i am field error',
    validateOn: 'onChange'
  }

  const wrapper = mount(
    <Form {...formProps}>
      <Field {...fieldProps} />
    </Form>
  )

  const props = wrapper.find(Field).props()

  t.is(props.validate, fieldProps.validate)
  t.is(props.validateOn, fieldProps.validateOn)
})

test('Form onSubmit calls onSubmit with formValues and isValid', t => {
  const onSubmit = sinon.spy()

  const formProps = {
    validate: () => '',
    validateOn: 'onSubmit',
    onSubmit
  }

  const wrapper = mount(
    <Form {...formProps}>
      <Field name='test' />
    </Form>
  )

  wrapper.find('form').simulate('submit')

  t.truthy(formProps.onSubmit.called)
})
