const debug = require('debug')('lhft-backend:services/mongoose')
const mongoose = require('mongoose')
const History = require('../models/history')
const { isUndefined } = require('../utils')

const MongooseService = ()  => {
  const start = async () => {
    try {
      const username = 'lhftUser'
      const password = 'lhft-backend'
      const dbname = 'lhft'
      const response = await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.vbaqa.mongodb.net/${dbname}?retryWrites=true&w=majority`)
      debug('start()', { response })
    } catch (error) {
      debug('start()', { error })
    }
  }

  const flushData = async () => {
    try {
      const currentTimestamp = Date.now()
      const outdatedTimestamp = currentTimestamp - (5 * 60 * 1000) // 5 mins
      await History.remove({ createdAt: { $lte: new Date(outdatedTimestamp) } })
    } catch (error) {
      debug('flushData()', { error })
    }
  }

  const pushData = async data => {
    try {
      // flush outdated data 
      await flushData()
      // bulk insert data
      await History.insertMany(data)
    } catch (error) {
      debug('pushData()', { error })
    }
  }

  const getData = async (options = {}) => {
    try {
      const { symbol, start, end } = options
      const findOptions = Object.assign({},
        !isUndefined(symbol) && { symbol },
        (!isUndefined(start) || !isUndefined(end)) && { createdAt: Object.assign({},
          !isUndefined(start) && { $gt: new Date(parseInt(start)) },
          !isUndefined(end) && { $lte: new Date(parseInt(end)) }
        )},
      )
      const response = await History.find(findOptions)
      return response
    } catch (error) {
      debug('getData()', { error })
      return []
    }
  }

  return {
    start,
    pushData,
    getData
  }
}

module.exports = MongooseService
