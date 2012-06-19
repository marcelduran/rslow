(function () {
    var 
        COUNT = 100,     // # of tests (reload)
        INTERVAL = 3000, // ms in between tests

        count = parseInt(sessionStorage.getItem('count') || 1, 10);

    if (count < COUNT) {
        sessionStorage.setItem('count', count + 1);
        setTimeout(function () {
            location.reload();
        }, INTERVAL);
    } else {
        sessionStorage.clear();
        document.write('done');
    }
}());
