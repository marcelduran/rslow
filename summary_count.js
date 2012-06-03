#!/usr/bin/env node

/*jslint stupid: true*/

'use strict';
var args = process.argv.slice(2),
    logs = args[0] || './logs/',
    fs = require('fs'),
    files =  fs.readdirSync(logs),
    results = [],
    keys = {};

files.forEach(function (file, index) {
    var content, log,
        count = {
            file: file
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
        if (!item.type) {
            return;
        }
        if (count.hasOwnProperty(item.type)) {
            count[item.type] += 1;
        } else {
            count[item.type] = 1;
        }
        if (!(keys.hasOwnProperty(item.type))) {
            keys[item.type] = 1;
        }
    });

    results.push(count);
});

keys = ['file'].concat(Object.keys(keys));
console.log(keys.join('\t'));
results.forEach(function (res) {
    console.log(keys.map(function (key) {
        return res[key];
    }).join('\t'));
});
