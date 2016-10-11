var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            //creep.say('harvesting');
            creep.say('harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy >= creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        //creep.say('upgrading');
	        creep.say('upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            
            sources = _.chain(sources)
                .sortByOrder('energy', 'asc')
                .map(function(source){
                    //console.log(source.energy);
                    
                    return source;
                })
                .value();
            
            /*
            if(false) {
                var max = 0;
                var sources = creep.room.find(FIND_SOURCES, {
                    filter: (source) => {
                        console.log(source.energy, max);
                        if (source.energy > max) {
                            max = source.energy;
                            console.log(source.energy, max, source.pos);
                            return true;
                        }
                        
                        return false;
                    }
                });
                
                var source = sources[0];
            }
            */
	        //console.log(sources.length, _.first(sources).energy);
	        /*
	        if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            	creep.moveTo(storage);    
            }
            */
	        
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
	}
};

module.exports = roleUpgrader;
