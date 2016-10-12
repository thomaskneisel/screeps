var roleInvader = {

    count: 6,

    rooms:  [
        'W51S62',
        'W52S61'
    ],

    /** @param {Creep} creep **/
    run: function(creep) {

        var chicken = creep.hits < creep.hitsMax/2;
        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile && !chicken) {
            if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestHostile);
            }
        } else {
            if(creep.carry.energy < creep.carryCapacity && !chicken) {
                if (creep.memory.roomToInvade == creep.room.name) {
                    this.ensureBuilder(creep, 1);
                    this.toResource(creep);
                } else {
                    this.toRoom(creep);
                }
            } else {
                this.backHome(creep);
            }
        }
    },

    ensureBuilder: function(creep, maxBuilders) {
        if (maxBuilders > _.size(creep.room.find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'builder' }))) {
            creep.memory.role = 'builder';
            creep.say('->builder');
            console.log(creep.name, 'became builder');

            return true;
        }

        return false;
    },

    toResource: function(creep) {
        var source = this.findSources(creep.room);
        if (source) {
            if (creep.harvest(source[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source[0]);
                creep.sayDelay('toSource', 5);
            }
        } else {
            console.log('Sources empty?');
            creep.say('noSources');
        }
    },

    toRoom: function(creep) {
        creep.sayDelay('toRoom', 2);

        var flags = _(Game.flags).filter((flag) => flag.name.substring(7) == creep.memory.roomToInvade);

        console.log('Flags:', flags ? flags : false);

        if (creep.memory.roomToInvade == 'W52S61' && !creep.memory.atFlag) {
            var flag = Game.flags['routeToW52S61'];

            if(creep.pos.isEqualTo(flag.pos)) {
                flag.setColor(COLOR_GREEN);
                creep.memory.atFlag = true;
                delete creep.memory.path;
                creep.say('da bin ich');
            } else {
                if (creep.fatigue > 0) {
                    creep.say('shit :/');
                }
                var moved = creep.moveByPath(creep.memory.path);
                if(moved == ERR_NOT_FOUND || moved == ERR_INVALID_ARGS) {
                    flag.setColor(COLOR_RED);
                    creep.memory.path = creep.pos.findPathTo(flag);
                    creep.say('newPath');
                } else {
                    flag.setColor(COLOR_YELLOW);
                    creep.say('toFlag');
                }

                if (!creep.memory.path) {
                    creep.memory.path = creep.pos.findPathTo(flag);
                    console.log('WehtehÃÂ¤ff?!');
                }
            }
        } else {
            var route = Game.map.findRoute(creep.room, creep.memory.roomToInvade);
            if(route.length > 0) {
                //console.log('Now heading to room '+route[0].room);
                var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
                creep.sayDelay('iv: ' + creep.memory.roomToInvade, 5);
            }
        }
    },

    backHome: (creep) => {
        creep.memory.atFlag = false;
        var home = Game.spawns[_.findKey(Game.spawns)];
        var container = home.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
        });

        if(container[0]) {
            home = container[0];
            creep.sayDelay('toContainer', 3);
        }

        if (creep.transfer(home, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(home);
            creep.sayDelay('backHome', 5);
        }
    },


    divideEqual: function() {
        return require('role.spawn').getCreeps('invader', true).groupBy((creep) => creep.memory.roomToInvade).map((values, name) => console.log(name, values.length, values));
    },

    /** @param {Room} room **/
    findSources: function(room) {
        return _.sortByOrder(
            room.find(FIND_DROPPED_ENERGY).concat(
                room.find(FIND_SOURCES),
                room.find(FIND_DROPPED_RESOURCES)
            ), 'energy', 'asc');
    }
};

module.exports = roleInvader;
