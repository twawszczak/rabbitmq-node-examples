const bunyan = require('bunyan')
const bunyanFormat = require('bunyan-format')

const AmqpConnectionManager = require('./AmqpConnectionManager')

class Producer {
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
   * @returns {Promise.<void>}
   */
  async createChannel () {
    await this._closeChannel()

    this._channel = await (await this._getAmqpConnection()).createChannel()
  }

  /**
   *
   * @param {string} queueName
   * @param {string} messageContent
   * @param {number} messageSize
   * @param {number} repeats
   * @returns {Promise.<void>}
   */
  async produce (queueName, messageContent, messageSize, repeats) {
    await this.assertQueue(queueName)
    const message = Buffer.alloc(messageSize).fill(messageContent)

    for (let i = 1; i <= repeats; i++) {
      try {
        this._channel.sendToQueue(queueName, message)
        this._log('debug', `Sent '${message.toString()}'`)
      } catch (error) {
        this._log('error', `Can not sent '${message.toString()}' to queue: ${queueName}. Reason: ${error.message}`)
      }
    }
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
   * @returns {Promise}
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

module.exports = Producer
