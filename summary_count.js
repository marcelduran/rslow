#!/usr/bin/env node

var LOGS = './logs/',
    fs = require('fs'),
    files =  fs.readdirSync(LOGS),
    results = [],
    keys = {};

// header
files.forEach(function (file, index) {
    var content = fs.readFileSync(LOGS + file),
        log,
        count = {
            file: file
        };

    try {
        log = JSON.parse(content);
    }
    catch(err) {
        console.log('Error parsing', file, ' ', err.message);
    }
    if (!log || !log.length) {
        return;
    }

    log.forEach(function (item) {
        if (!item.type) {
            return;
        }
        if (item.type in count) {
            count[item.type] += 1;
        } else {
            count[item.type] = 1;
        }
        if (!(item.type in keys)) {
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
