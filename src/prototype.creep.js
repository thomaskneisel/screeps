var roleRecycler = require('role.recycle');

var tmplPanel = _.template(
    '<div class="panel panel-default panel-${ type }">'+
        '<div class="panel-heading">'+
            '<h3 class="panel-title">${ title }</h3>'+
        '</div>'+
        '<div class="panel-body">${ message }</div>'+
    '</div>'
);

var tmplProgress = _.template(
    '<div class="progress" style="width: 100%; float: left;">' +
        '<div class="progress-bar progress-bar-info progress-bar-striped" style="width: ${ value }%; min-width: 2em;" role="progressbar" aria-valuenow="${ value }" aria-valuemin="${ min }" aria-valuemax="${ max }" >'+
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
    console.log(
        panel({
            type: 'info', 
            title: tmplTitle(this),
            message: 
                '<style> table td { border: 1px solid red; }</style><table>'+
                    '<tr><td><strong>Ticks</strong></td><td>' + creep.ticksToLive + '</td></tr>'+
                    '<tr><td><strong>TargetTicks</strong></td><td>' + targetTicksToLive + '</td></tr>'+
                '</table>'+ 
                progress({value: Math.floor(creep.ticksToLive / (targetTicksToLive/100)), min:0, max: 100})})
    );
}

module.exports = {

};
