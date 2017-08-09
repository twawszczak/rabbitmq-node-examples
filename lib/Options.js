class Options {
  /**
   *
   * @param {string[]} stringArgs
   * @returns {{}}
   */
  static extractOptionsFromStringArgs (stringArgs) {
    const values = {}
    stringArgs.map(valueString => valueString.split('=')).forEach(([key, value]) => {
      values[key] = value
    })

    return values
  }
}

module.exports = Options
