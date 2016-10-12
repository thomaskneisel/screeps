//renew lowes creep
renewLowest = function() {
    var spawn = require('role.spawn');
    return spawn.renew(spawn.getCreeps().sort((cA, cB) => cA.ticksToLive == cB.ticksToLive ? 0 : cA.ticksToLive > cB.ticksToLive ? 1 : -1).first().value())
}

/**
 * fetch a creep, spawn, room, controller
 * @param {string} name
 */
get = function(name) {
    return Game.creep[name] || Game.spawn[name]
}
