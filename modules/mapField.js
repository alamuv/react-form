import R from 'ramda'

const isEvent = R.has('nativeEvent')
const getEventValue = R.path(['target', 'value'])
const getValueFromEvent = R.ifElse(isEvent, getEventValue, R.identity)
const noop = () => {}

const resolveValidateEvent = validateOn => {
  return validateOn
    ? {
      focus: 'onFocus',
      blur: 'onBlur'
    }[validateOn]
    : {}
}

const mapField = (formConfig, formProps) => {
  const { updateFormValue, updateFormError, formValues, formErrors } = formProps

  const fields = R.mapObjIndexed((inputConfig, key) => {
    const { validateOn = '', validateWith = noop } = inputConfig
    const updateFormValueForKey = updateFormValue(key)
    const updateFormErrorForKey = updateFormError(key)

    const updateError = e => {
      const value = getValueFromEvent(e)
      const error = validateWith(value)

      updateFormErrorForKey(error)
    }

    const onChange = e => {
      if (validateOn === 'change') {
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
        ...resolveValidateEvent()
      },
      error: formErrors[key]
    })
  }, formConfig)

  return fields
}

export default mapField
