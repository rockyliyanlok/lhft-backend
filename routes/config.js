const express = require('express')
const { isInt, isUndefined, isNil } = require('../utils')
const { StatusCodes } = require('http-status-codes')

const router = express.Router()

router.post('/', (req, res, next) => {
  // parse params from body
  const {
    symbols,
    update_frequency_milliseconds: updateFrequencyMilliseconds,
    elements_per_update: elementsPerUpdate
  } = req.body
  // check params
  let message = null
  // check if symbols is an array of strings
  if (!isUndefined(symbols)) {
    if (!Array.isArray(symbols) || !symbols.every(symbol => typeof symbol === 'string')) {
      message = 'The `symbols` field should contains array of strings.'
    }
  }
  // check if update_frequency_milliseconds is an integer
  if (!isUndefined(updateFrequencyMilliseconds)) {
    if (!isInt(updateFrequencyMilliseconds)) {
      message = 'The `update_frequency_milliseconds` field should contains an integer.'
    }
  }
  // check if elements_per_update is an integer
  if (!isUndefined(elementsPerUpdate)) {
    if (!isInt(elementsPerUpdate)) {
      message = 'The `elements_per_update` field should contains an integer.'
    }
  }
  // return output
  if (message) {
    const err = new Error(message)
    return next(err)
  } else {
    const config = req.app.get('services/pricing').updateConfig(Object.assign({},
      !isNil(symbols) && { symbols },
      !isNil(updateFrequencyMilliseconds) && { updateFrequencyMilliseconds },
      !isNil(elementsPerUpdate) && { elementsPerUpdate }
    ))

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      config
    })
  }
})

module.exports = router
