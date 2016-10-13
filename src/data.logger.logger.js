

var logger =  function(method) {
    var callback = method;

    var log = function(type, message) {
        callback(message);
    }

    return {
        log: log
    }
}

module.exports = logger;
