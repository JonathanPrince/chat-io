'use strict';

var fs = require('fs');

module.exports = function(logEntry) {
  fs.appendFile('./log.log', logEntry, function (err){
    if (err) throw err;
  });
};
