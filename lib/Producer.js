const AmqpConnector = require('./AmqpConnector')

class Producer extends AmqpConnector {
  /**
   *
   * @param {string} queueName
   * @param {string} messageContent
   * @param {number|null} messageSize
   * @param {number} repeats
   * @returns {Promise.<void>}
   */
  async produce (queueName, messageContent, messageSize = null, repeats = 1) {
    await this.assertQueue(queueName)
    const message = Buffer.alloc(messageSize === null ? messageContent.length : Number(messageSize)).fill(messageContent)

    for (let i = 1; i <= repeats; i++) {
      try {
        await this._channel.sendToQueue(queueName, message)
        this._log('debug', `Sent '${message.toString()}'`)
      } catch (error) {
        this._log('error', `Can not sent '${message.toString()}' to queue: ${queueName}. Reason: ${error.message}`)
      }
    }
  }
}

module.exports = Producer
