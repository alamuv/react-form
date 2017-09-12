import { Component } from 'react'
import PropTypes from 'prop-types'
import R from 'ramda'

const isEvent = e => R.has('nativeEvent', e)

const getEventValue = R.path(['target', 'value'])

const validationEvents = ['onBlur', 'onFocus']

const getValueFromEvent = R.ifElse(isEvent, getEventValue, R.identity)

class Field extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  updateError = e => {
    const value = getValueFromEvent(e)
    const { validate, updateFormError } = this.props

    updateFormError(validate(value))
  }

  onChange = e => {
    const value = getValueFromEvent(e)

    if (this.props.validateOn === 'onChange') {
      this.updateError(e)
    }

    return this.props.updateFormValue(value)
  }

  getErrorProps = () => ({
    error: this.props.error,
    role: 'alert'
  })

  getLabelProps = () => ({
    htmlFor: this.props.id
  })

  getInputProps = () => {
    const defaultProps = {
      value: this.props.value,
      onChange: this.onChange,
      id: this.props.id
    }

    if (R.contains(this.props.validateOn, validationEvents)) {
      return {
        ...defaultProps,
        [this.props.validateOn]: this.updateError
      }
    }

    return defaultProps
  }

  getInputValues = () => ({
    error: this.props.error
  })

  render () {
    const { children } = this.props

    const childProps = {
      getInputProps: this.getInputProps,
      getInputValues: this.getInputValues,
      error: this.props.error
    }

    return children(childProps)
  }
}

Field.displayName = 'Field'

Field.defaultProps = {
  validate: () => ''
}

Field.propTypes = {
  updateFormValue: PropTypes.func,
  updateFormError: PropTypes.func,
  validateOn: PropTypes.oneOf(['onBlur', 'onSubmit', 'onChange', 'onFocus']),
  validate: PropTypes.func,
  children: PropTypes.func.isRequired
}

export default Field
