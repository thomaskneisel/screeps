var roleRecycle = {

    /** @param {Creep} creep **/
    /** @param {Spawn} spawn **/
    run: function(creep, spawn) {
        
        var toMove = false
        
        if (spawn == undefined) {
           spawn = Game.spawns[_.findKey(Game.spawns)];
        }
        
        if(creep.carry.energy == 0 || creep.transfer(spawn, RESOURCE_ENERGY) == ERR_FULL && creep.drop(RESOURCE_ENERGY) == OK) {
            var name = creep.name;
            var recycled = spawn.recycleCreep(creep);
            if(recycled == ERR_NOT_IN_RANGE) {
                toMove = true;
            } else if(recycled == OK) {
                console.log(creep.name, name, Memory.creeps[name]);
                delete Memory.creeps[name];
            }
        }
        
        if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            toMove = true;
        }
        
        if (toMove) {
            creep.say('Its a trap');
            creep.moveTo(spawn);
        }
        
        this.cleanMemory();    
	},
	
	cleanMemory: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
	},
	
	/** @param {String} role **/
	recycleAll: function(role) {
        _.chain(Game.creeps)
            .filter((creep) => role == undefined || creep.memory.role == role)
	        .map((creep) => {
	            this.recycle(creep);
            }, this)
	        .run();
	        
        this.cleanMemory();
	},
	
	/** @param {Creep} creep **/
	recycle: function(creep) {
	    if(creep) {
	       console.log('Recycle ' + creep.name);
	       creep.memory.role = 'recycle';
	    } else {
	        console.log('Creep [' + creep.name + '] not found');
	    }
	    this.cleanMemory();
	}
};

module.exports = roleRecycle;