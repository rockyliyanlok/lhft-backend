const debug = require('debug')('lhft-backend:services/client')
const uuid = require('uuid')

const ClientService = ()  => {
  let clients = []

  /**
   * Push a new client to the list and remove client on disconnection
   * @param {*} req 
   * @param {*} res 
   */
  const addClient = (req, res) => {
    const clientId = uuid.v4()
    debug('addClient()', { clientId })
    const newClient = {
      clientId,
      res
    }
    // push new client to the list
    clients.push(newClient)
    // remove client from the list on disconnection
    req.on('close', () => {
      clients = clients.filter(client => client.clientId !== clientId)
    })
  }

  /**
   * Send provided data to all connected clients
   * @param {*} data 
   */
  const broadcast = data => {
    clients.forEach(client => {
      // event stream format `data: ${message}\n\n`
      client.res.write(`data: ${JSON.stringify(data)}\n\n`) 
    })
  }

  return {
    addClient,
    broadcast
  }
}

module.exports = ClientService
