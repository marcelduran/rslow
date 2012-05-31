/* polyfills */
// shim layer with setTimeout fallback: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();



window.scrollTest = (function(){
    var startTime = null,
        endTimes  = [],
        timeDiff  = null,
        iterationsLeft = 0,
        baselineIterationsLeft = 0;

    var stress = function(){
        console.log(iterationsLeft);
        if(iterationsLeft < 1) {
            end();
            return;
        }

        window.scrollTo(0, iterationsLeft % 2 === 0 ? 100 : 0);

        iterationsLeft--;

        window.requestAnimationFrame(stress);
    };

    var baseline = function(){
        console.log(baselineIterationsLeft);

        if(baselineIterationsLeft < 1) {
            stress(iterationsLeft);
            return;
        }

        baselineIterationsLeft--;

        window.requestAnimationFrame(baseline);
    }

    var end = function(){
        endTime = window.performance.now ?
                  (performance.now() + performance.timing.navigationStart) : 
                  Date.now();
        timeDiff = endTime - startTime;
        console.log(timeDiff);
    };

    var start = function(iterations){
        document.body.setAttribute('style', 'min-height: 3000px;');

        iterationsLeft = iterations;

        // http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
        startTime = window.performance.now ?
                    (performance.now() + performance.timing.navigationStart) : 
                    Date.now();

        baseline();

        //stress(iterationsLeft);
    };

    return {
        start: start
    }
})();

scrollTest.start(100);