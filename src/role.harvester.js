module.exports = {

    count: 4,

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity && creep.memory.harvest) {
            var sources = _.filter(this.findSource(creep.room), (source) => {
                return _.indexOf(creep.memory.blockSources, source.structureType) == -1
            });

            /* debug
            if(!_.isEmpty(creep.memory.blockSources)) {
                console.log('blocked sources:', creep.name, creep.memory.blockSources);
            }
            console.log('--', sources);
            _.forEach(sources, (source) => console.log(source.id, source.energy));
            */

            if (sources[0]) {
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE
                || creep.pickup(sources[0]) == ERR_NOT_IN_RANGE
                || creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0].pos);
                }
            } else {
                creep.moveTo(20, 15);
                creep.sayDelay('noSources', 5);
                creep.memory.blockSources = [];
                creep.memory.harvest = false;

                //var msg = '<div style="color:red;">NoSources left</div>room['+creep.room.name+']';
                //Game.notify(msg, 5);
            }
        }
        else {
            creep.memory.harvest = false;
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                targets = _.sortBy(targets, (structure) => structure.structureType);
                var transfer = creep.transfer(targets[0], RESOURCE_ENERGY);
                if(transfer == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                if(transfer == OK) {
                    creep.memory.blockSources = [];
                }
            } else {
                var container = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                });

                if (container) {
                    var transfer = creep.transfer(container[0], RESOURCE_ENERGY);
                    if(transfer == ERR_NOT_IN_RANGE) {
                        creep.sayDelay('storage', 2);
                        creep.moveTo(container[0]);
                    }
                    if(transfer == OK) {
                        if (creep.memory.blockSources == undefined) {
                            creep.memory.blockSources = [];
                        }
                        creep.memory.blockSources.push(container[0].structureType);
                    }
                } else {
                    creep.moveTo(20, 15);
                    creep.sayDelay('idle', 5);
                    creep.memory.blockSources = [];
                }
            }
        }
        if (creep.carry.energy == 0 && !creep.memory.harvest) {
            creep.memory.harvest = true;
            creep.say('go harvest!');
        }
    },

    /** @param {Room} room **/
    findSource: function(room) {
        return _.sortByOrder(
            room.find(FIND_DROPPED_ENERGY).concat(
                room.find(FIND_SOURCES, { filter: (source) => source.energy > 0 }),
                room.find(FIND_STRUCTURES, { filter: (structure) =>
                    (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > 0
                })
            ), (source) => !source ? 0 : source.energy || source.store[RESOURCE_ENERGY], 'asc');
    }
};
