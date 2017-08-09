const amqplib = require('amqplib')

const connections = {}

class AmqpConnectionManager {
  /**
   *
   * @param {string} url
   * @returns {Promise.<*>}
   */
  static async getConnection (url) {
    if (!connections[url]) {
      connections[url] = await amqplib.connect()
    }

    return connections[url]
  }

  /**
   *
   * @param {string} url
   * @returns {Promise.<void>}
   */
  static async disconnect (url) {
    if (connections[url]) {
      await connections[url].close()
      delete connections[url]
    }
  }
}

module.exports = AmqpConnectionManager
