'use strict';

var fs = require('fs')
  , now = require('dateformat');

module.exports = function(logMessage) {
  var logEntry = now() + ' : ' + logMessage + '\n';
  fs.appendFile('./log.log', logEntry, function (err){
    if (err) throw err;
  });
};
