var prototypCreep = require('prototype.creep');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRecycler = require('role.recycle');
var roleInvader = require('role.invader');
var roleSpawn = require('role.spawn');

var checkEveryTick = 7;

module.exports.loop = function () {
    
    var tower = Game.getObjectById('57fc14fdba828cf03db240c3');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure && tower.energy > tower.energyCapacity / 2) {
            tower.repair(closestDamagedStructure);
        }
        
        var closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (creep) => creep.hits < creep.hitsMax
        });
        if(closestDamagedCreep) {
            tower.heal(closestDamagedCreep);
        }
        
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if (creep.ticksToLive < 20) {
            creep.memory.role = 'recycle';
        }
        if(creep.memory.role == 'renew' || creep.ticksToLive < 400) {
            roleSpawn.renew(creep, 1200);
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'recycle') {
            roleRecycler.run(creep);
        }
        if(creep.memory.role == 'invader') {
            roleInvader.run(creep);
        }
    }
    
    if (0 == Game.time % checkEveryTick) {
        roleSpawn.check();
        roleRecycler.cleanMemory();
    }
}
