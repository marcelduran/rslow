#!/usr/bin/env node

var LOGS = './logs/',
    fs = require('fs'),
    files =  fs.readdirSync(LOGS);

// header
console.log([
    'FILE\t\t',
    'LAYOUT',
    'RESTYLE',
    'PAINT',
    'TOTAL'
].join('\t'));

files.forEach(function (file, index) {
  var content = fs.readFileSync(LOGS + file),
      log,
      times = {
        Layout: 0,
        RecalculateStyles: 0,
        Paint: 0
      };

  try {
    log = JSON.parse(content);
  }
  catch(err) {
    console.log('Error parsing', file, ' ', err.message);
  }
  if (!log || !log.length) return;

  log.forEach(function (item) {
    if (item.type in times) {
      times[item.type] += item.endTime - item.startTime;
    }
  });

  console.log([file,
      times.Layout.toFixed(2),
      times.RecalculateStyles.toFixed(2),
      times.Paint.toFixed(2),
      (times.Layout + times.RecalculateStyles + times.Paint).toFixed(2)
  ].join('\t'));
});
