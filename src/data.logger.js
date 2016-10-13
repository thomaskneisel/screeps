var dataLogger = {

    logTypes: {
        debug: -1,
        success: 0,
        info: 1,
        warn: 2,
        error: 3
    },

    loggers: [
        {
            log: function(type, message) {
                console.log(message)
            }
        }
    ],

    /**
     * @param {string} type - message type
     * @param {string} message - message text
     */
    log: function(type, message) {
        _(this.loggers).forEach((logger) => logger.log(type, message))
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
