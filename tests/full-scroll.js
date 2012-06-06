/*jslint browser: true*/
/*global performance*/
(function (win, doc) {
    'use strict';
    var scrollHeight, startTime, goingUp,

        requestAnimationFrame, pushResult, end, fullScroll,

        goingDown = true,
        nextScroll = 0,
        pathname = win.location.pathname,

        SCROLL_STEP = 45, // the larger the faster
        COUNT = 100,      // # of tests (reload)
        INTERVAL = 1000;  // ms in between tests

    /* polyfills */
    // shim layer with setTimeout fallback:
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    requestAnimationFrame = (function () {
        return win.requestAnimationFrame    ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame    ||
            win.oRequestAnimationFrame      ||
            win.msRequestAnimationFrame     ||
            function (callback) {
                win.setTimeout(callback, 1000 / 60);
            };
    }());

    pushResult = function (result) {
        var res = sessionStorage.getItem(pathname);

        if (!res) {
            res = [];
        } else {
            res = res.split(',');
        }
        res.push(result);
        sessionStorage.setItem(pathname, res);
    };

    end = function () {
        var count,
            endTime = win.performance && win.performance.webkitNow
                ? (win.performance.webkitNow() + performance.timing.navigationStart)
                : Date.now();
        alert(endTime)
        alert(endTime - startTime)
        pushResult(endTime - startTime);

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
        }
    };

    fullScroll = function () {
        if ((goingDown && nextScroll < scrollHeight) ||
                (goingUp && nextScroll > 0)) {
            nextScroll += SCROLL_STEP * (goingDown ? 1 : -1);
            win.scrollTo(0, nextScroll);
            requestAnimationFrame(fullScroll);
        } else if (!goingUp) {
            goingUp = true;
            goingDown = false;
            requestAnimationFrame(fullScroll);
        } else {
            end();
        }
    };

    // start
    doc.body.setAttribute('style', 'min-height: 3000px;');
    scrollHeight = doc.body.scrollHeight;
    pathname = pathname.slice(1).replace(/\//g, '_')
        .replace('.html', '');

    // http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-
    // now-with-sub-millisecond-precision
    startTime = win.performance && win.performance.webkitNow
        ? (performance.webkitNow() + performance.timing.navigationStart)
        : Date.now();

    fullScroll();
}(window, document));
