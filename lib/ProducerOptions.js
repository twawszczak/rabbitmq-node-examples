const Options = require('./Options')

class ProducerOptions extends Options {
  constructor (customValues, argsStringValues) {
    super(customValues, argsStringValues, {
      appName: 'mq-producer',
      amqpUrl: 'amqp://localhost',
      queueName: 'test-queue',
      durable: true,
      dlx: '',
      messageSize: 1,
      messageContent: 'A',
      repeats: 1,
      logLevel: 'debug',
      isLoggerColored: true
    })
  }

  get appName () {
    return this.get('appName')
  }

  get amqpUrl () {
    return this.get('amqpUrl')
  }

  get queueName () {
    return this.get('queueName')
  }

  get durable () {
    return this.get('durable')
  }

  get dlx () {
    return this.get('dlx')
  }

  get messageSize () {
    return this.get('messageSize')
  }

  get messageContent () {
    return this.get('messageContent')
  }

  get repeats () {
    return this.get('repeats')
  }

  get logLevel () {
    return this.get('logLevel')
  }

  get isLoggerColored () {
    return this.get('isLoggerColored')
  }
}

module.exports = ProducerOptions
