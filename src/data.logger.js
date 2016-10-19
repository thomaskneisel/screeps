var dataLogger = {

    logTypes: {
        debug: 0,
        success: 120,
        info: 240,
        warn: 30,
        error: 0
    },

    loggers: [],

    /**
     * @param {string} type - message type
     * @param {string} message - message text
     */
    log: function(type, message) {
        this.loggers.forEach((logger) => logger.log(type, message));
    },

    /**
     * @param {string} message
     */
    success: function(message) {
        this.log(this.logTypes.success, message);
    },

    /**
     * @param {string} message
     */
    info: function(message) {
        this.log(this.logTypes.info, message);
    },

    /**
     * @param {string} message
     */
    warn: function(message) {
        this.log(this.logTypes.warn, message);
    },

    /**
     * @param {string} message
     */
    error: function(message) {
        this.log(this.logTypes.error, message);
    }
}

module.exports = dataLogger;
