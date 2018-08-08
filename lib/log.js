'use strict'

const fs = require('fs')
const now = require('dateformat')

module.exports = function (logMessage) {
  const logEntry = `${now()} : logMessage\n`
  fs.appendFile('./log.log', logEntry, (err) => {
    if (err) throw err
  })
}
