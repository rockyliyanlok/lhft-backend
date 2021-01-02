const debug = require('debug')('lhft-backend:middleware/errorHandler')
const { StatusCodes } = require('http-status-codes')

module.exports = () => {
  return (err, req, res, next) => {
    if (err) {
      debug(err)
      if (err.status === StatusCodes.BAD_REQUEST && err.type === 'entity.parse.failed') {
        // express json parse error
        return res.status(err.status).json({
          status: err.status,
          message: 'The raw body should contains a valid JSON format.'
        })
      } else {
        const status = err.status || StatusCodes.BAD_REQUEST
        return res.status(status).json({
          status: status,
          message: err.message
        })
      }
    }

    return next(err)
  }
}