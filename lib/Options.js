class Options {
  /**
   *
   * @param customValues
   * @param argsStringValues
   * @param defaultValues
   */
  constructor (customValues, argsStringValues, defaultValues = {}) {
    this._values = defaultValues

    this._populateValues(customValues)
    this._populateValuesFromArgsString(argsStringValues)
  }

  /**
   *
   * @param {string} key
   * @returns {{}}
   */
  get (key) {
    if (!this.checkKey(key)) {
      throw new Error(`Cannot get config value for key ${key} - config does not contain that key.`)
    }

    return this._values[key]
  }

  /**
   *
   * @param {string} key
   * @returns {boolean}
   */
  checkKey (key) {
    return this._values.hasOwnProperty(key)
  }

  /**
   *
   * @param {string[]} stringValues
   * @private
   */
  _populateValuesFromArgsString (stringValues) {
    const values = {}
    stringValues.map(valueString => valueString.split('=')).forEach(([key, value]) => {
      values[key] = value
    })

    this._populateValues(values)
  }

  /**
   *
   * @param {{}} values
   * @param {boolean} safeMode
   * @private
   */
  _populateValues (values, safeMode = true) {
    Object.keys(values).forEach((key) => {
      if (!this.checkKey(key)) {
        if (safeMode) {
          throw new Error(`Cannot populate config value for key ${key} - config does not contain that key.`)
        }

        return false
      }

      this._values[key] = values[key]
    })
  }
}

module.exports = Options
