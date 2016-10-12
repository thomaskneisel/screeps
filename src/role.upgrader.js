var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy >= creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var sources = this.findSources(creep.room);

            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
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

module.exports = roleUpgrader;
