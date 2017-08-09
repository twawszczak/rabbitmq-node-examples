#!/usr/bin/env node

'use strict'

const Options = require('./lib/Options')
const Consumer = require('./lib/Consumer')

const consumerOptions = Object.assign({
  appName: 'mq-consumer',
  amqpUrl: 'amqp://localhost',
  queuesNames: 'incoming:test-queue',
  exchangeName: '',
  republishQueueName: '',
  noAck: false,
  reasons: {
    lost: 0,
    die: 0,
    reject: 0,
    republish: 0
  },
  maxRetries: 0,
  logLevel: 'debug'
}, Options.extractOptionsFromStringArgs(process.argv));

(module.exports = async () => {
  const consumer = await new Consumer(consumerOptions.amqpUrl)
  consumer.createLogger(consumerOptions.appName, consumerOptions.logLevel, process.stdout.isTTY)
  await consumer.connect()
  consumer.consume(consumerOptions.queuesNames.split(':'), consumerOptions)
})().catch(console.error)
