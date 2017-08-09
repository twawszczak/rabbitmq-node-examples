const AmqpConnector = require('./AmqpConnector')

const REASON_LOST = 'lost'
const REASON_DIE = 'die'
const REASON_REJECT = 'reject'
const REASON_REPUBLISH = 'republish'
const REASON_ACK = 'ack'

class Consumer extends AmqpConnector {
  /**
   *
   * @returns {Promise.<void>}
   */
  async createChannel () {
    await super.createChannel()

    this._channel.prefetch(1)
  }

  /**
   *
   * @param {string[]} queues
   * @param {{exchangeName: string, republishQueueName: string,  noAck: boolean, reasons: {lost: number, die: number, reject: number, republish: number}, maxRetries: number}} options
   */
  consume (queues = [], options) {
    queues.forEach(queueName => {
      this._log('info', `Waiting for messages in ${queueName}`)

      this._channel.consume(queueName, (message) => this._handleMessage(message, options), {
        noAck: options.noAck
      })
    })
    this._log('info', 'To exit press CTRL+C')
  }

  /**
   *
   * @param {{content: string, properties: {}}} message
   * @param {{exchangeName: string, republishQueueName: string,  noAck: boolean, reasons: {lost: number, die: number, reject: number, republish: number}, maxRetries: number}} options
   * @private
   */
  _handleMessage (message, options) {
    console.log(message.content.toString())

    const reason = Consumer._findReason(options)

    switch (reason) {
      case REASON_ACK:
        this.__ackMessage(message, options.noAck)
        break
      case REASON_REJECT:
        this._rejectMessage(message, options.noAck)
        break
      case REASON_REPUBLISH:
        const retriesCounter = Consumer.parseXDeathHeader(message)
        if (retriesCounter >= options.maxRetries) {
          this._rejectMessage(message, options.noAck)
        } else {
          if (options.republishQueueName) {
            this._channel.sendToQueue(options.republishQueueName, message.content, message.properties)
          } else {
            this._channel.publish(options.exchangeName, '', message.content, message.properties)
          }
          this.__ackMessage(message, options.noAck)
        }
        break
      case REASON_DIE:
        process.exit(6)
    }
  }

  /**
   *
   * @param message
   * @param {boolean} noAck
   * @private
   */
  __ackMessage (message, noAck) {
    if (!noAck) {
      this._channel.ack(message)
    }
  }

  /**
   *
   * @param message
   * @param {boolean} noAck
   * @private
   */
  _rejectMessage (message, noAck) {
    if (!noAck) {
      this._channel.noAck(message, false, false)
    }
  }

  /**
   *
   * @param message
   * @returns {number}
   */
  static parseXDeathHeader (message) {
    try {
      return Number(message.properties.headers['x-death'][0].count) || 0
    } catch (error) {
      return 0
    }
  }

  /**
   *
   * @param {{lost: number, die: number, reject: number, republish: number}} reasons
   * @returns {string}
   * @private
   */
  static _findReason (reasons) {
    if (Math.random() <= reasons.lost) {
      return REASON_LOST
    }

    if (Math.random() <= reasons.die) {
      return REASON_DIE
    }

    if (Math.random() <= reasons.reject) {
      return REASON_REJECT
    }

    if (Math.random() <= reasons.republish) {
      return REASON_REPUBLISH
    }

    return REASON_ACK
  }
}

module.exports = Consumer
