#!/usr/bin/env node

'use strict';

var noclean,

    LOGS = './logs/',

    fs = require('fs'),
    files =  fs.readdirSync(LOGS),
    args = process.argv.slice(2),

    header = {
        'Layout': 1,
        'RecalculateStyles': 1,
        'Paint': 1,
        'Total': 1
    },

    // sort array by object key function
    sortByKey = function (k) {
        return function (a, b) {
            return a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0;
        };
    };

// check for "noclean"
if (args.indexOf('noclean') > -1) {
    noclean = true;
    args.splice(args.indexOf('noclean'), 1);
}

// check args for data to display
if (args.length) {
    header = {};
    args.forEach(function (arg) {
        arg = arg[0].toUpperCase() + arg.slice(1).toLowerCase();
        arg = arg.replace('Reflow', 'RecalculateStyles');
        header[arg] = 1;
    });
}

// header
console.log(
    ['FILENAME', 'COUNT'].concat(
        Object.keys(header).map(function (key) {
            key = key.replace('RecalculateStyles', 'Reflow').toUpperCase();
            return [
                key + ' SUM',
                key + ' MIN',
                key + ' MAX',
                key + ' MEDIAN',
                key + ' AVG'
            ].join('\t');
        })
    ).concat(
        noclean ? [] : [
            'CLEAN COUNT',
            Object.keys(header).map(function (key) {
                key = 'CLEAN ' +
                    key.replace('RecalculateStyles', 'Reflow').toUpperCase();
                return [
                    key + ' SUM',
                    key + ' MIN',
                    key + ' MAX',
                    key + ' MEDIAN',
                    key + ' AVG'
                ].join('\t');
            })
        ]
    ).join('\t')
);

// loop log files
files.forEach(function (file) {
    var
        clen, lower, upper,
        content = fs.readFileSync(LOGS + file),
        log = JSON.parse(content),
        len = log.length,
        render = [],
        time = {
            'Layout': 0,
            'RecalculateStyles': 0,
            'Paint': 0,
            'Total': 0
        },
        acc = {
            'Layout': 0,
            'RecalculateStyles': 0,
            'Paint': 0,
            'Total': 0
        },
        calc = {
            'Layout': {},
            'RecalculateStyles': {},
            'Paint': {},
            'Total': {}
        };

    // loop logs
    log.forEach(function (item, index) {
        if (time.hasOwnProperty(item.type)) {
            time[item.type] += (item.endTime - item.startTime);
            time.Total += (item.endTime - item.startTime);
        }
        if (item.type === 'TimerFire' || index === len - 1) {
            Object.keys(acc).forEach(function (key) {
                acc[key] += time[key];
            });
            render.push(time);
            time = {
                'Layout': 0,
                'RecalculateStyles': 0,
                'Paint': 0,
                'Total': 0
            };
        }
    });

    // calc values
    len = render.length;
    lower = Math.round(len * 0.05);
    upper = Math.round(len * 0.95);
    clen = upper - lower;
    Object.keys(calc).forEach(function (key) {
        var crender,
            sum = 0;

        // sort by key
        render.sort(sortByKey(key));

        // calc
        calc[key].min = render[0][key];
        calc[key].median = render[parseInt(len / 2, 10)][key];
        calc[key].max = render[len - 1][key];
        calc[key].avg = acc[key] / len;

        // clean noise
        crender = render.slice(lower, upper);
        calc[key].cmin = crender[0][key];
        calc[key].cmedian = crender[parseInt(clen / 2, 10)][key];
        calc[key].cmax = crender[clen - 1][key];
        crender.forEach(function (time) {
            sum += time[key];
        });
        calc[key].csum = sum;
        calc[key].cavg = sum / clen;
    });

    // output
    console.log(
        [file, len].concat(
            Object.keys(header).map(function (key) {
                return [
                    acc[key].toFixed(3),
                    calc[key].min.toFixed(3),
                    calc[key].max.toFixed(3),
                    calc[key].median.toFixed(3),
                    calc[key].avg.toFixed(3)
                ].join('\t');
            })
        ).concat(
            noclean ? [] : [
                clen,
                Object.keys(header).map(function (key) {
                    return [
                        calc[key].csum.toFixed(3),
                        calc[key].cmin.toFixed(3),
                        calc[key].cmax.toFixed(3),
                        calc[key].cmedian.toFixed(3),
                        calc[key].cavg.toFixed(3)
                    ].join('\t');
                })
            ]
        ).join('\t')
    );
});