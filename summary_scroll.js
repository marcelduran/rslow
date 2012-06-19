#!/usr/bin/env node

/*jslint stupid: true*/

'use strict';
var args = process.argv.slice(2),
    logs = args[0] || './logs/',
    fs = require('fs'),
    files =  fs.readdirSync(logs);

// header
console.log([
    'FILE', 'TEST', 'COUNT', 'MIN', 'MAX', 'MEDIAN', 'AVG', 'MODE'].join('\t'));

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
            var avg, median, min, max, modes, mode,
                sum = 0,
                ht = {},
                times = item[key],
                len = times.length;

            times.sort();
            times.forEach(function (time) {
                sum += time;
                if (typeof ht[time] !== 'undefined') {
                    ht[time] += 1;
                } else {
                    ht[time] = 1;
                }
            });
            avg = sum / len;
            median = times[parseInt(len / 2, 10)];
            min = times[0];
            max = times[len - 1];
            modes = Object.keys(ht);
            modes.sort(function (a, b) {
                return ht[a] < ht[b] ? 1 : -1;
            });
            mode = modes[0];

            console.log([file, key, len, min, max, median, avg, mode]
                .join('\t'));
        });
    });
});
