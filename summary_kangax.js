#!/usr/bin/env node

var LOGS = './logs/',
    fs = require('fs'),
    files =  fs.readdirSync(LOGS);

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

  console.log('\nStats for', file);
  console.log('\n  Layout\t\t', times.Layout.toFixed(2), 'ms');
  console.log('  Recalculate Styles\t', times.RecalculateStyles.toFixed(2), 'ms');
  console.log('  Paint\t\t\t', times.Paint.toFixed(2), 'ms\n');
  console.log('  Total\t\t\t', (times.Layout + times.RecalculateStyles + times.Paint).toFixed(2), 'ms\n');
});
