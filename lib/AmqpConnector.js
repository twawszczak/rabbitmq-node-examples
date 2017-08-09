const bunyan = require('bunyan')
const bunyanFormat = require('bunyan-format')

const AmqpConnectionManager = require('./AmqpConnectionManager')

class AmqpConnector {
  /**
   *
   * @param {string} url
   */
  constructor (url) {
    this._logger = null
    this._channel = null
    this._amqpUrl = url
  }

  /**
   *
   * @return {Promise.<void>}
   */
  async connect () {
    await this.createChannel()
  }

  /**
   *
   * @return {Promise.<void>}
   */
  async disconnect () {
    await this._closeChannel()
    await AmqpConnectionManager.disconnect(this._amqpUrl)
  }

  /**
   *
   * @returns {Promise.<void>}
   */
  async createChannel () {
    await this._closeChannel()

    this._channel = await (await this._getAmqpConnection()).createChannel()
  }

  /**
   *
   * @param {string} appName
   * @param {string} logLevel
   * @param {boolean} isColor
   */
  createLogger (appName, logLevel, isColor = true) {
    this._logger = bunyan.createLogger({
      name: appName,
      level: logLevel,
      stream: bunyanFormat({
        outputMode: 'long',
        color: isColor
      })
    })
  }

  /**
   *
   * @param {string} queueName
   * @param {boolean} durable
   * @param {string|null} dlx
   * @return {Promise.<void>}
   */
  async assertQueue (queueName, durable = true, dlx = null) {
    await this._channel.assertQueue(
      queueName,
      {durable: durable, arguments: dlx !== null ? {deadLetterExchange: dlx} : {}}
    )
  }

  /**
   *
   * @returns {Promise.<*>}
   * @private
   */
  async _getAmqpConnection () {
    return AmqpConnectionManager.getConnection(this._amqpUrl)
  }

  async _closeChannel () {
    if (this._channel) {
      await this._channel.close()
    }
  }

  _log (type, message) {
    if (this._logger) {
      this._logger[type](message)
    }
  }
}

module.exports = AmqpConnector
