// import isValidHostname from 'is-valid-hostname';
import validate from 'uuid-validate'
import { isURL } from 'validator'
import { extend } from 'vee-validate'
import { confirmed, email, length, min, required } from 'vee-validate/dist/rules'

function isValidContainerName(value) {
  const reg = /^[\w\-]+$/
  return reg.test(value) && value.length <= 32
}

extend('required', {
  ...required,
  message: 'This field is required',
})

extend('email', {
  ...email,
  message: 'This field must be a valid email',
})

extend('confirmed', {
  ...confirmed,
  message: 'This field confirmation does not match',
})

extend('length', {
  ...length,
  message: 'This field must have 2 options',
})

extend('min', {
  ...min,
  message: 'This field must have more than {length} characters',
})

extend('ContainerName', {
  validate: value => isValidContainerName(value),
  message: 'Name must be a string of numbers, letters, underscores, or hyphens(0~9,a~zA~Z,_,-).',
})

extend('uuid', {
  validate: value => validate(value),
  message: 'You entered an invalid share ID',
})

extend('url', {
  validate: value => isURL(value, { require_protocol: true }),
  message: 'The field mast be a valid url',
})

extend('yaml_port', {
  validate: (value) => {
    // match 1 to 3 digits, for example "192"
    const num = '\\d{1,3}'

    // match IP address, for example "
    const ip = `(${num}\\.){3}${num}`

    // match 1 to 5 digits, may also contain a hyphen and another 1 to 5 digits, for example "80-8080"
    const portRange = '\\d{1,5}(-\\d{1,5})?'

    // match IP address and an optional port range, or just match port range
    // eslint-disable-next-line regexp/no-unused-capturing-group
    const regExp = new RegExp(`^(${ip}(:${portRange})?)|(^${portRange})$`)
    return regExp.test(value)
  },
  message: 'The field mast be a valid docker-compose port',
})

extend('not_in_ports', {
  validate: (value, isInPortsResult) => {
    // true : 满足，成功
    // false : 不满足， 报错
    // return true
    return isInPortsResult?.[0] === 'false'
  },
  message: 'The port is used by other services',
})
