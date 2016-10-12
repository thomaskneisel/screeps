var roleRecycler = require('role.recycle');

var style =
    '<style>'+
        '.panel, .panel-body, div.progress { padding-top: 0; padding-bottom: 1px; margin-bottom: 0; color: black;}'+
        '.panel, .debug { border: 1px solid red; }'+
        '.debug-green { border-color: green; }'+
        '.debug-blue { border-color: blue; }'+
    '</style>';


var tmplPanel = _.template(
    style +
    '<div class="panel panel-default panel-${ type } debug">'+
        '<div class="panel-heading debug debug-green">'+
            '<h3 class="panel-title">${ title }</h3>'+
        '</div>'+
        '<div class="panel-body debug debug-blue">${ message }</div>'+
    '</div>'
);

var tmplProgress = _.template(
    '<div class="progress debug debug-green">' +
        '<div class="progress-bar progress-bar-info progress-bar-striped active" style="width: ${ value }%; min-width: 2em;" role="progressbar" aria-valuenow="${ value }" aria-valuemin="${ min }" aria-valuemax="${ max }" >'+
            '${ value }%'+
        '</div>'+
    '</div>'
);

Creep.prototype.sayDelay = function(text, ticks) {
    Game.time % ticks == 0 ? this.say(text) : '';
}

Creep.prototype.getRole = function() {
    return this.memory.role
}

Creep.prototype.setRole = function(role) {
    this.memory.role = role;
}

Creep.prototype.resetRole = function() {
    this.memory.role = this.memory.origin;
}
Creep.prototype.recycle = function() {
    roleRecycler.recycle(this);
}

Creep.prototype.info = function() {

    var tmplTitle = _.template('Creep ${ name } [id:${ id }]');
    var targetTicksToLive = 1500;
    console.log(
        tmplPanel({
            type: 'info',
            title: tmplTitle(this),
            message: tmplProgress({value: Math.floor(this.ticksToLive / (targetTicksToLive/100)), min:0, max: 100})
        })
    );
}

module.exports = {

};
