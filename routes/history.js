const express = require('express')
const { isUndefined, isNil, isEmpty } = require('../utils')
const { StatusCodes } = require('http-status-codes')

const router = express.Router()

router.get('/', async (req, res, next) => {
  // parse params from query
  const {
    symbol,
    start,
    end
  } = req.query
  // check params
  let message = null
  // check if symbol exists
  if (isUndefined(symbol) || isEmpty(symbol)) {
    message = 'The `symbol` field is required.'
  }
  // check if start is a valid timestamp
  if (!isUndefined(start)) {
    if (isNaN(parseFloat(start))) {
      message = 'The `start` field should contains a valid timestamp.'
    }
  }
  // check if end is a valid timestamp
  if (!isUndefined(end)) {
    if (isNaN(parseFloat(end))) {
      message = 'The `end` field should contains a valid timestamp.'
    }
  }
  // return output
  if (message) {
    const err = new Error(message)
    return next(err)
  } else {
    const histories = await req.app.get('services/mongoose').getData(Object.assign({},
      !isNil(symbol) && { symbol },
      !isNil(start) && { start },
      !isNil(end) && { end }
    ))

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      histories
    })
  }
})

module.exports = router
