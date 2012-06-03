#!/usr/bin/env node

/*jslint stupid: true*/

'use strict';
var args = process.argv.slice(2),
    logs = args[0] || './logs/',
    fs = require('fs'),
    files =  fs.readdirSync(logs);

// header
console.log([
    'FILE',
    'LAYOUT',
    'RESTYLE',
    'PAINT',
    'TOTAL'
].join('\t'));

files.forEach(function (file, index) {
    var content = fs.readFileSync(logs + file),
        log,
        times = {
            Layout: 0,
            RecalculateStyles: 0,
            Paint: 0
        };

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
        if (times.hasOwnProperty(item.type)) {
            times[item.type] += item.endTime - item.startTime;
        }
    });

    console.log([
        file,
        times.Layout.toFixed(2),
        times.RecalculateStyles.toFixed(2),
        times.Paint.toFixed(2),
        (times.Layout + times.RecalculateStyles + times.Paint).toFixed(2)
    ].join('\t'));
});
