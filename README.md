# react-form

## Usage

```js
import React from 'react'
import Form from '@kofile/react-form'

class MyForm extends React.Component {
  genericValidate = v => v ? '' : 'error message'

  isPhoneNumber = v => { 
    /* some regex magic */
    return isNumber ? '' : 'error message'
  }

  handleSubmit = ({ formValues, formErrors, isValid }) => {
    if (!isValid) {
      return handleErrors(formErrors)
    }

    return handleSuccess(formValues)
  }

  render() {
    return (
      <div>
        <h2>My Awesome Form!</h2>
        <Form onSubmit={this.handleSubmit} validate={this.genericValidate} validateOn='onBlur'>
          <Form.Field id="name">
            {({ getInputProps, getLabelProps, getErrorProps }) => {
              const { value, id, ...props } = getInputProps()
              const { htmlFor, ...labelProps } = getLabelProps()
              const { error } = getErrorProps()

              return (
                <label htmlFor={htmlFor}>Your Name Is?</label>
                <input id={id} value={value} {...props} />
              )
            }}
          </Form.Field>
          <Form.Field id="age">
            {({ getInputProps, getLabelProps, getErrorProps }) => {
              const { value, id, ...props } = getInputProps()
              const { htmlFor, ...labelProps } = getLabelProps()
              const { error } = getErrorProps()

              return (
                <label htmlFor={htmlFor}>Your age Is?</label>
                <input id={id} value={value} type="number" {...props} />
              )
            }}
          </Form.Field>
          <Form.Field id="location">
            {({ getInputProps, getLabelProps, getErrorProps }) => {
              const { value, id, ...props } = getInputProps()
              const { htmlFor, ...labelProps } = getLabelProps()
              const { error } = getErrorProps()

              return (
                <label htmlFor={htmlFor}>Your location Is?</label>
                <textarea id={id} value={value} {...props} />
              )
            }}
          </Form.Field>
        </Form>
      </div>
    )
  }
}
```