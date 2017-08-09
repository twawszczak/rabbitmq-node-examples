const Options = require('./Options')

class ProducerOptions extends Options {
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

  get loggerColor() {
    return this.get('loggerColor');
  }
}

module.exports = ProducerOptions;