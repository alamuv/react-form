import React, { Component } from 'react'
import R from 'ramda'
import Field from './Field.js'

const clone = React.cloneElement

const checkChildType = child => {
  if (child.type.name !== 'Field') {
    return false
  }

  return true
}

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

  updateChildErrorsOnSubmit = () => {
    const formFields = this.props.children.filter(checkChildType)

    if (this.props.validateOn === 'onSubmit') {
      const errorArray = formFields.map(({ props }) => {
        const { id, validate, value } = props

        if (props.validateOn && props.validateOn !== 'onSubmit') {
          return
        }

        const validationResponse = validate(value)

        return validationResponse ? { [id]: validationResponse } : {}
      })

      return this.setState({ formErrors: R.mergeAll(errorArray) })
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    const formFields = this.props.children.filter(checkChildType)

    const { formErrors } = this.state

    const valid = formFields.every(({ props }) => {
      const { id, validate, value } = props

      return !formErrors[id] && R.complement(validate)(value)
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

      this.updateChildErrorsOnSubmit()
    }
  }

  render () {
    const { children } = this.props

    const mappedChildren = React.Children.map(children, child => {
      const { id, validate, validateOn } = child.props

      if (!checkChildType(child)) {
        return child
      }

      return clone(child, {
        updateFormValue: this.updateFormValue(id),
        updateFormError: this.updateFormError(id),
        value: this.state.formValues[id] || '',
        error: this.state.formErrors[id] || '',
        validate: validate || this.props.validate,
        validateOn: validateOn || this.props.validateOn
      })
    })

    return <form onSubmit={this.handleSubmit}>{mappedChildren}</form>
  }
}

Form.Field = Field

export default Form
