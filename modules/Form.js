import React, { Component } from 'react'
import PropTypes from 'prop-types'
import R from 'ramda'
import mapField from './mapField.js'
import { runAllValidations } from './utils.js'

const noop = () => {}

class Form extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formValues: {},
      formErrors: {}
    }
  }

  updateFormState = newState => {
    this.props.onChange(newState)

    this.setState(newState)
  }

  updateFormValue = key => value => {
    const newState = R.mergeDeepRight(this.state, {
      formValues: { [key]: value }
    })

    this.updateFormState(newState)
  }

  updateFormError = key => error => {
    const newState = error
      ? R.mergeDeepRight(this.state, {
        formErrors: { [key]: error }
      })
      : this.state

    this.updateFormState(newState)
  }

  updateChildErrorsOnSubmit = fields => {
    const errorArray = R.values(fields).map(field => {
      const { id, validateWith = [], validateOn = [], value } = field

      if (!R.contains('submit', validateOn)) {
        return
      }

      const validationResponse = runAllValidations(value, validateWith)

      return validationResponse ? { [id]: validationResponse } : {}
    })

    return this.setState({ formErrors: R.mergeAll(errorArray) })
  }

  handleSubmit = fields => e => {
    e.preventDefault()

    const { formErrors, formValues } = this.state

    const valid = R.values(fields).every(field => {
      const { id, validateWith = [] } = field
      const value = formValues[id]

      return !formErrors[id] && !runAllValidations(value, validateWith)
    })

    if (valid) {
      this.props.onSubmit({
        formValues: this.state.formValues,
        isValid: true
      })
    } else {
      this.props.onSubmit({
        formValues: this.state.formValues,
        isValid: false
      })

      this.updateChildErrorsOnSubmit(fields)
    }
  }

  render () {
    const { render, config } = this.props
    const formProps = {
      ...this.state,
      updateFormError: this.updateFormError,
      updateFormValue: this.updateFormValue
    }

    const fields = mapField(config, formProps)

    return <form onSubmit={this.handleSubmit(fields)}>{render(fields)}</form>
  }
}

Form.displayName = 'Form'
Form.propTypes = {
  config: PropTypes.object,
  render: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
}

Form.defaultProps = {
  onChange: noop,
  onSubmit: noop,
  render: () => null,
  config: {}
}

export default Form
