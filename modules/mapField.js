import R from 'ramda'
import {
  getValueFromEvent,
  runAllValidations,
  resolveValidateEvent
} from './utils.js'

const mapField = (formConfig, formProps) => {
  const { updateFormValue, updateFormError, formValues, formErrors } = formProps

  const fields = R.mapObjIndexed((inputConfig, key) => {
    const { validateOn = [], validateWith = [] } = inputConfig
    const updateFormValueForKey = updateFormValue(key)
    const updateFormErrorForKey = updateFormError(key)

    const updateError = e => {
      const value = getValueFromEvent(e)
      const error = runAllValidations(value, validateWith)

      updateFormErrorForKey(error)
    }

    const onChange = e => {
      if (R.contains('change', validateOn)) {
        updateError(e)
      }

      const value = getValueFromEvent(e)

      return updateFormValueForKey(value)
    }

    return Object.assign(key, {
      inputProps: {
        id: key,
        onChange,
        value: formValues[key] || '',
        ...resolveValidateEvent(validateOn, validateWith)
      },
      error: formErrors[key]
    })
  }, formConfig)

  return fields
}

export default mapField
