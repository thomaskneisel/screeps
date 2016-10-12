var panel = _.template(
    '<div class="panel panel-default panel-${ type }">'+
        '<div class="panel-heading">'+
            '<h3 class="panel-title">${ title }</h3>'+
        '</div>'+
        '<div class="panel-body">${ message }</div>'+
    '</div>'
);

var alert = _.template(
    '<div class="alert alert-${ type } alert-dismissible" style="text- role="alert">'+
        '<strong>${ title }</strong> ${ message }</div>'+
    '</div>'
);

module.exports = {

    types: {
        success: 'success',
        info: 'info',
        warning: 'warning',
        danger: 'danger'
    },

    log: function(type, message, title) {
        if (undefined == message) {
            message = 'You don\'t log a message, dumass';
        }
        if (undefined == type) {
            type = this.types.info;
        }
        if (undefined == title) {
            title = '';
        }
        console.log(alert({type: type, title: title, message: message}));
    },

    logSuccess: function(message, title) {
        console.log('.', this);
        this.log(this.types.success, title, message);
    },
    logInfo: function(message, title) {
        this.log(this.types.info, title, message);
    },
    logWarn: function(message, title) {
        console.log(this);
        this.log(this.types.warning, title, message);
    },
    logError: function(message, title) {
        this.log(this.types.danger, title, message);
    },

    register: function() {

        if (!console.success) {
            console.success = this.logSuccess;
            console.log(console.success);
            console.log('->', console);
            console.success('test');
        }

        if (!console.info) {
            console.info = this.logInfo;
            console.log(console);
        }

        if (!console.warn) {
            console.warn = this.logWarn;
            console.log(console);
        }

        if (!console.error) {
            console.error = this.logError;
        }

        console.log(console);
    }
};
