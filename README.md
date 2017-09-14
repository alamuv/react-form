# react-form

## Usage

```js
import React from 'react'
import { Form } from '@kofile/react-form'

const config = {
  email: {
    validateOn: 'change',
    validateWith: v => v ? '' : 'error message'
  },
  password: {
    validateOn: 'blur',
    validateWith: v => v ? '' : 'fix your password!!!'
  }
}

class MyForm extends React.Component {
  handleSubmit = ({ formValues, isValid }) => {
    if (!isValid) {
      return;
    }

    return handleSuccess(formValues)
  }

  render() {
    return (
      <div>
        <h2>My Awesome Form!</h2>
        <Form onSubmit={this.handleSubmit} config={config} render={(fields) => (
          <div>
            <label {...fields.email.labelProps}>Email</label>
            <input {...fields.email.inputProps}/>
          </div>
          <div>
            <label {...fields.password.labelProps}>Password</label>
            <input {...fields.password.inputProps}/>
          </div>
        )} />
      </div>
    )
  }
}
```