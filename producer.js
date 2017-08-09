#!/usr/bin/env node

'use strict'

const Producer = require('./lib/Producer')
const Options = require('./lib/Options')

const producerOptions = Object.assign({
  appName: 'mq-producer',
  amqpUrl: 'amqp://localhost',
  queueName: 'test-queue',
  durable: true,
  dlx: null,
  messageSize: null,
  messageContent: 'A',
  repeats: 1,
  logLevel: 'debug',
  isLoggerColored: true
}, Options.extractOptionsFromStringArgs(process.argv));

(module.exports.run = async () => {
  const producer = await new Producer(producerOptions.amqpUrl)
  producer.createLogger(producerOptions.appName, producerOptions.logLevel, producerOptions.isLoggerColored)
  await producer.connect()
  await producer.produce(producerOptions.queueName, producerOptions.messageContent, producerOptions.messageSize, producerOptions.repeats)
  producer.disconnect()
})().catch(console.error)
