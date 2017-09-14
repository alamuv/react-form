import R from 'ramda'

const isEvent = e => R.has('nativeEvent', e)
const getEventValue = R.path(['target', 'value'])
const getValueFromEvent = R.ifElse(isEvent, getEventValue, R.identity)
const noop = () => {}

const mapField = (formConfig, formProps) => {
  const { updateFormValue, updateFormError, formValues, formErrors } = formProps

  const fields = R.mapObjIndexed((inputConfig, key) => {
    const { validateOn = noop, validateWith = noop } = inputConfig
    const updateFormValueForKey = updateFormValue(key)
    const updateFormErrorForKey = updateFormError(key)

    const updateError = e => {
      const value = getValueFromEvent(e)

      updateFormErrorForKey(validateWith(value))
    }

    const onChange = e => {
      const value = getValueFromEvent(e)

      if (validateOn === 'change') {
        updateError(e)
      }

      return updateFormValueForKey(value)
    }

    const validateEvent = {
      focus: 'onFocus',
      blur: 'onBlur'
    }[validateOn]

    return {
      inputProps: {
        id: key,
        onChange,
        value: formValues[key],
        [validateEvent]: updateError
      },
      labelProps: {
        htmlFor: key
      },
      error: formErrors[key]
    }
  }, formConfig)

  return fields
}

export default mapField
