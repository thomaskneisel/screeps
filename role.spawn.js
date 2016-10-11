var roleRecycle = require('role.recycle')
var roleHarvester = require('role.harvester')
var roleInvader = require('role.invader')

var devCreeps = {
    base: [CARRY, MOVE, WORK, WORK], //300
    //harvester: [CARRY, CARRY, MOVE, WORK, WORK], //350
    //harvester: [CARRY, CARRY, MOVE, MOVE, WORK, WORK], //400
    //harvester: [CARRY, CARRY, CARRY, MOVE, MOVE, WORK, WORK], //450
    //harvester: [CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK], //500
    //harvester: [CARRY, CARRY, MOVE, WORK, WORK, WORK, WORK], //550
    //harvester: [CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK], //600
    //harvester: [CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK], //650
    //harvester: [CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], //700
    //harvester: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], //800 Carry
    harvester: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], //800 MOVE
    
    //upgrader: [CARRY, MOVE, MOVE, WORK, WORK], //350
    //upgrader: [CARRY, MOVE, MOVE, MOVE, WORK, WORK], //400
    //upgrader: [CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK], //450
    //upgrader: [CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK], //500
    //upgrader: [CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK], //550
    upgrader: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], //800
    
    //builder: [CARRY, MOVE, MOVE, WORK, WORK] //350
    //builder: [CARRY, CARRY, MOVE, MOVE, WORK, WORK] //400
    //builder: [CARRY, CARRY, MOVE, WORK, WORK, WORK] //450
    //builder: [CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK] //500
    //builder: [CARRY, CARRY, MOVE, WORK, WORK, WORK, WORK], //550
    //builder: [CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], //700
    builder: [CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK], // 800
    
    //invader: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK] //550
    //invader: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK] //700
    invader: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK] //800
}

var devBuilds = {
    harvesterBig: {
       name: 'BigHarvester',
       body: devCreeps.harvester.concat(devCreeps.base),
       memory: { role: 'harvester', origin: 'harvester' },
	   count: 0
   },
   harvester: {
       name: 'Harvester',
       body: devCreeps.harvester,
       memory: { role: 'harvester', origin: 'harvester' },
	   count: roleHarvester.count
   },
   upgrader: {
       name: 'Upgrader',
       body: devCreeps.upgrader,
       memory: { role: 'upgrader', origin: 'upgrader' },
	   count: 4
   },
   builder: {
       name: 'Builder',
       body: devCreeps.builder,
       memory: { role: 'builder', origin: 'builder' },
	   count: 2
   },
   invader: {
       name: 'Invader',
       body: devCreeps.invader,
       memory: { role: 'invader', origin: 'invader', roomToInvade: roleInvader.rooms[_.random(0, roleInvader.rooms.length - 1)] },
	   count: roleInvader.count
   }
}

var roleSpawn = {
    
    check: function() {
        var creeps = _.groupBy(Game.creeps, (creep) => creep.memory.origin)
        
        for(var cr in devBuilds) {
            var build = devBuilds[cr];
            var elements = creeps[build.memory.role];
            if (elements.length < build.count) {
                console.log('CREATE', build.name, build.count, 'of', elements.length);
                this.create(cr);
            } else {
                console.log('<span style="color: lightgreen;">OK</span>', build.name, build.count, 'of', elements.length);
            }
            
            if (!build.costs) {
                var costs = 0;
                _.forIn(build.body, (key, value) => costs += BODYPART_COST[key]);
                build.costs = costs;
                build.memory.costs = costs;
            }
        
            //console.log(build.name, _.size(elements), '-', build.costs, build.body);
        }
    },
    
    /** 
     * @param {String} name
     * @param {Array} body
     * @param {{}} memory
     * @param {Spawn} spawn
     */
    create: function(name, body, memory, spawn) {
        if (name == undefined) {
            return ERR_INVALID_ARGS;
        }

        if (spawn == undefined) {
           spawn = Game.spawns[_.findKey(Game.spawns)];
           spawn.memory.count = spawn.memory.count == undefined ? _.size(Game.creeps) : spawn.memory.count;
        }
        
        if (devBuilds[name]) {
            console.log('Create dev: ' + name + ' . ' + devBuilds[name]);
            body = devBuilds[name].body;
            memory = devBuilds[name].memory;
            name = devBuilds[name].name + spawn.memory.count;
        } else {
            console.log('Create custom: ' + name );
        }

        var result = spawn.canCreateCreep(body, name, memory);
        if (result == ERR_NAME_EXISTS) {
            spawn.memory.count++;
            console.log(name,spawn.memory.count);
        }
        if (result == OK) {
            result = spawn.createCreep(body, name, memory);
            spawn.memory.count++;
        
            console.log('created:' + result);
        } else {
            
            console.log('can´t create, check values!', result, '<a href="#!/room/' + spawn.room.name + '">' + spawn.room.name + '</a>');
            /*
            console.log('body: ', body);
            console.log('name: ' + name);
            console.log('memory: ' + memory);
            */
            
            result = ERR_INVALID_ARGS;
        }
        
        console.log('---');
        
        return result;        
    },

    /** @param {Creep} creep
     *  @param {Integer} ticksToLive
     *  @param {Spawn} spawn
     */
    renew: function(creep, targetTicksToLive, spawn) {
        creep.memory.role = 'renew';
        if (spawn == undefined) {
           spawn = Game.spawns[_.findKey(Game.spawns)];
        }
        
        targetTicksToLive += creep.memory.renewCount ? creep.memory.renewCount : 1;
        
        var creepLink = _.template('<a href="#!/creep/<%= name %>"><%= name %></a>');
        console.log('renew:', creepLink(creep), ' - ticks:', creep.ticksToLive, ' - targetTicks:', targetTicksToLive);
        
        var renewd = spawn.renewCreep(creep);
        var unload = creep.transfer(spawn, RESOURCE_ENERGY);
        if (renewd == ERR_NOT_IN_RANGE) {
            creep.sayDelay('renewing', 5);
            creep.moveTo(spawn);
        }
        
        if (renewd == OK && creep.ticksToLive > targetTicksToLive || creep.ticksToLive > targetTicksToLive) {
            !creep.memory.renewCount ? creep.memory.renewCount = 1 : creep.memory.renewCount++;
            creep.memory.role = creep.memory.origin;
            creep.say('r:' + creep.memory.renewCount + ':' + creep.ticksToLive);
        }
        
        roleRecycle.cleanMemory();
    },
    
    /** @param {String} role **/
    ping: function(role) {
        _.chain(Game.creeps)
            .filter((creep) => role == undefined || creep.memory.role == role)
            .map((creep) => {
                creep.say(creep.memory.role)
            }).value();
    },
    
    /** @param {String} role **/
    /** @param {Bool} origin **/
    getCreeps: function(role, origin) {
        return _.chain(Game.creeps)
            .filter((creep) => role == undefined || (origin && creep.memory.origin == role) || (!origin && creep.memory.role == role))
            .values();
    }
}

module.exports = roleSpawn;