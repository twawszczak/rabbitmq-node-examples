const amqplib = require('amqplib')
const bunyan = require('bunyan')
const bunyanFormat = require('bunyan-format')

let connection

class Producer {
  /**
   *
   * @param {ProducerOptions} producerOptions
   */
  constructor (producerOptions) {
    this._logger = null
    this._channel = null
    this._options = producerOptions
  }

  /**
   *
   * @return {Promise.<void>}
   */
  async connect () {
    await Producer._establishConnection(this._options.amqpUrl)
    await this.createChannel()
  }

  /**
   *
   * @return {Promise.<void>}
   */
  async disconnect () {
    await this._channel.close()
    await connection.close()
  }

  /**
   *
   * @param {string} appName
   * @param {string} logLevel
   * @param {boolean} isColor
   */
  createLogger (appName = this._options.appName, logLevel = this._options.logLevel, isColor = false) {
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
    this._closeChannel()

    this._channel = await connection.createChannel()
  }

  async produce (queuesName = this._options.queueName,
                 messageContent = this._options.messageContent,
                 messageSize = this._options.messageSize,
                 repeats = this._options.repeats) {
    await this.assertQueue(queuesName)
    const message = Buffer.alloc(messageSize).fill(messageContent)

    for (let i = 1; i <= repeats; i++) {
      try {
        this._channel.sendToQueue(this._options.QUEUE, message)
        this._log('debug', `Sent '${message.toString()}'`)
      } catch (error) {
        this._log('error', `Can not sent '${message.toString()}' to queue: ${queuesName}. Reason: ${error.message}`)
      }
    }
  }

  /**
   *
   * @param {string} queueName
   * @param {boolean} durable
   * @param {string} dlx
   * @return {Promise.<void>}
   */
  async assertQueue (queueName, durable, dlx) {
    await this._channel.assertQueue(
      queueName,
      {durable: durable, arguments: {deadLetterExchange: dlx}}
    )
  }

  /**
   *
   * @param {string} url
   */
  static async _establishConnection (url) {
    if (!connection) {
      connection = await amqplib.connect(url)
    }
  }

  _closeChannel () {
    if (this._channel) {
      this._channel.close()
    }
  }

  _log (type, message) {
    if (this._logger) {
      this._logger[type](message)
    }
  }
}

module.exports = Producer
