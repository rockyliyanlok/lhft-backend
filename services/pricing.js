const debug = require('debug')('lhft-backend:services/pricing')
const defaultConfig = require('../config/default.json')
const deepEqual = require('deep-equal')

const PricingService = app  => {
  let config = {
    symbols: defaultConfig.symbols,
    updateFrequencyMilliseconds: defaultConfig.update_frequency_milliseconds,
    elementsPerUpdate: defaultConfig.elements_per_update
  }
  let updateInterval = null
  let updateIndex = 0

  /**
   * Get next batch of update symbols from the config file
   */
  const getUpdateSymbols = () => {
    const { symbols, elementsPerUpdate } = config
    const updateSymbols = symbols.slice(updateIndex, Math.min(updateIndex + elementsPerUpdate, symbols.length))
    
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
  const start = () => {
    debug('start()')
    updateInterval = setInterval(() => {
      const updateSymbols = getUpdateSymbols()
      const symbolsWithPrice = randomizePrice(updateSymbols)

      app.get('services/client').broadcast(symbolsWithPrice)
      app.get('services/mongoose').pushData(symbolsWithPrice)
    }, config.updateFrequencyMilliseconds)
  }

  const stop = () => {
    debug('stop()')
    if (updateInterval) {
      clearInterval(updateInterval)
    }
  }

  const restart = () => {
    debug('restart()')
    // stop service
    stop()
    // restart setting
    updateIndex = 0
    // start service
    start()
  }

  const setConfig = newConfig => {
    const mergedConfig = Object.assign({},
      config,
      newConfig
    )

    // skip service restart if config is not changed
    if (!deepEqual(mergedConfig, config)) {
      config = mergedConfig
      debug('setConfig()', { config })
      restart()
    }

    return config
  }

  const getConfig = () => {
    return {
      symbols: config.symbols,
      update_frequency_milliseconds: config.updateFrequencyMilliseconds,
      elements_per_update: config.elementsPerUpdate
    }
  }

  return {
    start,
    stop,
    setConfig,
    getConfig
  }
}

module.exports = PricingService
