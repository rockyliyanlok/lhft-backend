const debug = require('debug')('lhft-backend:services/pricing')
const defaultConfig = require('../config/default.json')

const PricingService = ()  => {
  let updateFrequencyMilliseconds = defaultConfig.update_frequency_milliseconds
  let updateInterval = null
  let updateIndex = 0

  /**
   * Get next batch of update symbols from the config file
   */
  const getUpdateSymbols = () => {
    const { symbols, elements_per_update: elementsPerUpdate } = defaultConfig
    const updateSymbols = symbols.slice(updateIndex, Math.min(updateIndex + elementsPerUpdate, symbols.length - 1))
    
    updateIndex += elementsPerUpdate
    if (updateIndex >= symbols.length) {
      updateIndex = 0
    }

    return updateSymbols
  }

  /**
   * Randomize price for symbols range from 0 to 99999 
   * @param {*} symbols 
   */
  const randomizePrice = symbols => {
    return symbols.map(symbol => ({
      symbol,
      price: Math.round(Math.random() * 100000)
    }))
  }

  /**
   * Start the pricing service to randomize price for the symbols in the config file
   */
  const start = app => {
    debug('start()')
    if (updateInterval) {
      clearInterval(updateInterval)
    }
    updateInterval = setInterval(() => {
      const updateSymbols = getUpdateSymbols()
      const symbolsWithPrice = randomizePrice(updateSymbols)

      debug({
        symbolsWithPrice
      })
      app.get('services/client').broadcast(symbolsWithPrice)
    }, updateFrequencyMilliseconds)
  }

  return {
    start
  }
}

module.exports = PricingService