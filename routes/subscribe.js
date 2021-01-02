const express = require('express')

const router = express.Router()

/**
 * Handle client connections
 * @param {*} req 
 * @param {*} res 
 */
const subscribeHandler = (req, res) => {
  // Mandatory headers and http status to keep connection open
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  })
  // Push client to the client service
  req.app.get('services/client').addClient(req, res)
}

router.get('/', subscribeHandler)

module.exports = router
