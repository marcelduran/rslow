#!/usr/bin/env node

/*jslint stupid: true*/

'use strict';
var args = process.argv.slice(2),
    logs = args[0] || './logs/',
    fs = require('fs'),
    files =  fs.readdirSync(logs);

// header
console.log([
    'FILE', 'TEST', 'COUNT', 'MIN', 'MAX', 'MEDIAN', 'AVG'].join('\t'));

files.forEach(function (file, index) {
    var content, log;

    try {
        content = fs.readFileSync(logs + file);
        log = JSON.parse(content);
    } catch (err) {
        console.log('Error parsing', file, ' ', err.message);
    }
    if (!log || !log.length) {
        return;
    }

    log.forEach(function (item) {
        Object.keys(item).forEach(function (key) {
            var avg, median, min, max,
                sum = 0,
                times = item[key],
                len = times.length;

            times.sort();
            times.forEach(function (time) {
                sum += time;
            });
            avg = sum / len;
            median = times[parseInt(len / 2, 10)];
            min = times[0];
            max = times[len - 1];

            console.log([file, key, len, min, max, median, avg].join('\t'));
        });
    });
});
