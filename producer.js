const Producer = require('./lib/Producer')
const ProducerOptions = require('./lib/ProducerOptions')

const producerOptions = new ProducerOptions({
  isLoggerColored: process.stdout.isTTY
}, process.argv.slice(2));

(module.exports.run = async () => {
  const producer = await new Producer(producerOptions)
  producer.createLogger(producerOptions.appName, producerOptions.logLevel)
  await producer.connect()
  await producer.produce()
  producer.disconnect()
})().catch(console.error)
