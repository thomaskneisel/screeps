module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }

        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }  else {
                targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if(targets) {
                    if(creep.repair(targets) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets);
                        creep.sayDelay('rep', 3);
                    }
                } else {
                    creep.moveTo(31, 19);
                    if (creep.room.controller.my) {
                        creep.say('i->upgrader');
                        creep.memory.role = 'upgrader';
                    } else {
                        creep.sayDelay('idle', 3);
                    }
                }
            }
        }
        else {
            var sources = this.findSources(creep.room);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE || creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    },

    /** @param {Room} room **/
    findSources: function(room) {
        return _.sortByOrder(
            room.find(FIND_STRUCTURES, { filter: (structure) =>
                    structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
            }).concat(room.find(FIND_SOURCES, { filter: (source) => source.energy > 0 })),
            (source) => source.energy || source.store[RESOURCE_ENERGY], 'asc');
    }
};
