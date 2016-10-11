var roleRecycler = require('role.recycle');

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

module.exports = {

};
