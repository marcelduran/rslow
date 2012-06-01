/*jslint browser: true*/
/*global performance*/
(function (win, doc) {
    'use strict';
    var
        scrollHeight,
        startTime,
        timeDiff,
        goingUp,
        goingDown = true,
        endTimes = [],
        baselineIterationsLeft = 0,
        pathname = win.location.pathname,

        SCROLL_STEP = 50, // the larger the faster
        COUNT = 5,      // # of tests (reload)
        INTERVAL = 1000,  // ms in between tests

        /* polyfills */
        // shim layer with setTimeout fallback: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        requestAnimationFrame = (function () {
            return win.requestAnimationFrame    ||
                win.webkitRequestAnimationFrame ||
                win.mozRequestAnimationFrame    ||
                win.oRequestAnimationFrame      ||
                win.msRequestAnimationFrame     ||
                function (callback) {
                    win.setTimeout(callback, 1000 / 60);
                };
        }()),

        pushResult = function (result) {
            var res = sessionStorage.getItem(pathname);

            if (!res) {
                res = [];
            } else {
                res = res.split(',');
            }
            res.push(result);
            sessionStorage.setItem(pathname, res);
        },

        end = function () {
            var count,
                endTime = win.performance.now
                    ? (performance.now() + performance.timing.navigationStart)
                    : Date.now();
            timeDiff = endTime - startTime;
            pushResult(timeDiff);

            // reload
            count = parseInt(sessionStorage.getItem('count') || 1, 10);

            if (count < COUNT) {
                sessionStorage.setItem('count', count + 1);
                setTimeout(function () {
                    location.reload();
                }, INTERVAL);
            } else {
                // dump to local storage
                localStorage.setItem(pathname,
                    sessionStorage.getItem(pathname));
                sessionStorage.clear();
                doc.write('done');
            }
        },

        baseline = function () {
            if ((goingDown && baselineIterationsLeft < scrollHeight) ||
                    (goingUp && baselineIterationsLeft > 0)) {
                baselineIterationsLeft += SCROLL_STEP * (goingDown ? 1 : -1);
                win.scrollTo(0, baselineIterationsLeft);
                requestAnimationFrame(baseline);
            } else if (!goingUp) {
                goingUp = true;
                goingDown = false;
                requestAnimationFrame(baseline);
            } else {
                end();
            }
        },

        start = function () {
            doc.body.setAttribute('style', 'min-height: 3000px;');
            scrollHeight = doc.body.scrollHeight;

            // http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
            startTime = win.performance.now ?
                        (performance.now() + performance.timing.navigationStart) :
                        Date.now();

            baseline();
        };
    start();
}(window, document));
