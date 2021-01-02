const isInt = value => {
  var x = parseFloat(value)
  return !isNaN(value) && (x | 0) === x
}

const isNull = value => value === null
const isUndefined = value => typeof value === 'undefined'
const isNil = value => isUndefined(value) || isNull(value)

module.exports = {
  isInt,
  isNull,
  isUndefined,
  isNil
}
