import React, { Component } from 'react'
import PropTypes from 'prop-types'
import R from 'ramda'
import mapField from './mapField.js'
import { runAllValidations } from './utils.js'

const noop = () => {}

class Form extends Component {
  constructor (props) {
    super(props)

    const { config } = props

    const defaultValues = R.compose(
      R.pickBy(R.complement(R.isNil)),
      R.pickBy(R.complement(R.isEmpty)),
      R.mapObjIndexed(R.prop('value'))
    )(config)

    this.state = {
      formValues: defaultValues,
      formErrors: {}
    }
  }

  updateFormState = stateChange => {
    this.props.onChange(R.merge(this.state, stateChange))

    this.setState(stateChange)
  }

  updateFormValue = key => value => {
    const { formValues } = this.state
    const newState = R.merge(formValues, {
      [key]: value
    })

    this.updateFormState({ formValues: newState })
  }

  updateFormError = key => error => {
    const { formErrors } = this.state

    const newState = error
      ? R.merge(formErrors, {
        [key]: error
      })
      : formErrors

    this.updateFormState({ formErrors: newState })
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
