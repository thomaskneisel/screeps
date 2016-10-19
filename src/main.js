require('prototype.console');

var prototypCreep = require('prototype.creep');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRecycler = require('role.recycle');
var roleRenew = require('role.renew');
var roleInvader = require('role.invader');
var roleSpawn = require('role.spawn');

var checkEveryTick = 10;

globalSpawn = roleSpawn;
logger = require('data.logger');
var Logger = require('data.logger.logger');

logger.loggers.push(require('data.logger.email'));
logger.loggers.push(new Logger(console.log));

logger.success('Init');

module.exports.loop = function () {

    if (0 == Game.time % checkEveryTick) {
        logger.info('Spawn check');
        roleSpawn.check();
    }

    if (0 == Game.time % checkEveryTick * 2) {
        logger.info('Clean memory');
        roleRecycler.cleanMemory();
    }

    var tower = Game.getObjectById('57fc14fdba828cf03db240c3');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL,
            sort: (structureA, structureB) => structureA.structureType < structureB.structureType ? 1 : structureA.structureType < structureB.structureType ? -1 : 0
        });
        if(closestDamagedStructure && tower.energy > tower.energyCapacity / 1.25) {
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
        if(creep.memory.role == 'renew' || (creep.ticksToLive < 400 && creep.memory.role != 'harvester')) {
            roleRenew.renew(creep, 1200);
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


}
