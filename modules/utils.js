import R from 'ramda'

const isEvent = R.has('nativeEvent')
const getEventValue = R.path(['target', 'value'])

export const getValueFromEvent = R.ifElse(isEvent, getEventValue, R.identity)

export const noop = () => {}

const acceptedEvents = [
  'blur',
  'focus',
  'keyUp',
  'keyPress',
  'keyUp',
  'click',
  'doubleClick',
  'drag',
  'dragEnd',
  'dragEnter',
  'dragExit',
  'dragLeave',
  'dragOver',
  'dragStart',
  'drop',
  'mouseDown',
  'mouseEnter',
  'mouseLeave',
  'mouseMove',
  'mouseOut',
  'mouseOver',
  'mouseUp'
]

export const isAcceptedEvent = event => R.contains(event, acceptedEvents)

const capitalize = s => `${R.toUpper(R.head(s))}${R.tail(s)}`

export const makeEventName = shorthand => `on${capitalize(shorthand)}`

export const runAllValidations = (input = '', validateWith = []) =>
  R.reduceWhile(R.isEmpty, (acc, validate) => validate(input), '', validateWith)

export const resolveValidateEvent = (validateOn = [], validateWith = []) => {
  const validateInput = e =>
    runAllValidations(getValueFromEvent(e), validateWith)

  const inputProps = R.reduce(
    (acc, val) =>
      isAcceptedEvent(val)
        ? R.merge(acc, { [makeEventName(val)]: validateInput })
        : acc,
    {},
    validateOn
  )

  return inputProps
}
