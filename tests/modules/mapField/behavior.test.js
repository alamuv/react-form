import test from 'ava'
import sinon from 'sinon'
import mapField from '../../../modules/mapField.js'

test('mapField correctly maps value handlers', t => {
  const updateFormErrorSpy = sinon.spy()
  const updateFormValueSpy = sinon.spy()

  const formProps = {
    updateFormError: key => () => updateFormErrorSpy(key),
    updateFormValue: key => (value) => updateFormValueSpy(value),
    formValues: { email: 'test', password: 'pass' },
    formErrors: { email: '', password: '' }
  }
  const formConfig = {
    email: {},
    password: {}
  }

  const fields = mapField(formConfig, formProps)

  fields.email.inputProps.onChange('emailUpdate')
  fields.password.inputProps.onChange('passwordUpdate')

  t.truthy(updateFormValueSpy.calledWith('emailUpdate'))
  t.truthy(updateFormValueSpy.calledWith('passwordUpdate'))
})

test('mapField correctly maps error handlers', t => {
  const updateFormErrorSpy = sinon.spy()
  const updateFormValueSpy = sinon.spy()

  const formProps = {
    updateFormError: key => (value) => updateFormErrorSpy(value),
    updateFormValue: key => (value) => updateFormValueSpy(value),
    formValues: { email: 'test', password: 'pass' },
    formErrors: { email: '', password: '' }
  }
  const formConfig = {
    email: {
      validateOn: 'change',
      validateWith: () => 'stuff'
    },
    password: {}
  }

  const fields = mapField(formConfig, formProps)

  fields.email.inputProps.onChange('emailUpdate')

  t.truthy(updateFormErrorSpy.calledWith('stuff'))
})
