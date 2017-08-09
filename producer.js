const Producer = require('./lib/Producer')
const ProducerOptions = require('./lib/ProducerOptions')

const producerOptions = new ProducerOptions({
  appName: 'mq-producer',
  amqpUrl: 'amqp://localhost',
  queueName: 'incoming',
  durable: true,
  dlx: 'deferred',
  messageSize: 1,
  messageContent: 'A',
  repeats: 1,
  logLevel: 'debug'
}, {}, process.argv.slice(2));

(async () => {
  const producer = await new Producer(producerOptions)
  producer.createLogger(producerOptions.appName, producerOptions.logLevel, process.stdout.isTTY)
  await producer.connect()
  await producer.produce()
  producer.disconnect()
})().catch(console.error)
