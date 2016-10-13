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
    //invader: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK] //800
    invader: [TOUGH, TOUGH, CARRY, CARRY, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, ATTACK] //800
}

var devBuilds = {
   harvester: {
       name: 'Harvester',
       body: devCreeps.harvester,
       memory: { role: 'harvester', origin: 'harvester' },
       count: 4
   },
   upgrader: {
       name: 'Upgrader',
       body: devCreeps.upgrader,
       memory: { role: 'upgrader', origin: 'upgrader' },
       count: 1
   },
   builder: {
       name: 'Builder',
       body: devCreeps.builder,
       memory: { role: 'builder', origin: 'builder' },
       count: 1
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

        var styles =
        '<style>'+
            '@keyframes OK { from {background-color: green; color: white; } to {background-color: lightgreen; color: black;} }' +
            '@keyframes BUILD { from {background-color: yellow; color: black;} to {background-color: red; color: white } }' +
            '.ok { color: white; background-color: green; animation: OK 3s ease 1s infinite alternate; }' +
            '.build { animation: BUILD 2s ease-out 0s infinite alternate;}' +
            '.btn { padding: 2px 4px; }' +
        '</style>';

        for(var cr in devBuilds) {
            var build = devBuilds[cr];
            var elements = creeps[build.memory.role] || [];

            if (elements.length == undefined) {
                Game.notify('YOU HAVE A PROBLEM HERE!! [elements.length == undefined]');
            }
            if (elements.length < build.count) {
                if (this.create(cr) == OK) {
                    console.log(styles, '<span class="ok btn btn-xs">OK</span>', build.name, elements.length, 'of', build.count);
                } else {
                    console.log(styles, '<span class="build btn-xs">CAN NOT CREATE</span>', build.name, elements.length, 'of', build.count);
                }

            } else {
                console.log(styles, '<span class="ok btn btn-xs">OK</span>', build.name, build.count, 'of', elements.length);
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
            console.log('can\'t create, check values!', result);
            /*
            console.log('body: ', body);
            console.log('name: ' + name);
            console.log('memory: ' + memory);
            */
            result = ERR_INVALID_ARGS;
        }

        //console.log('---');

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

        var bodySize = _.size(creep.body);
        var renewHits = _.floor(600/bodySize)
        var renewCosts = _.ceil(creep.memory.costs/2.5/bodySize)

        console.log('hits:', renewHits, 'for', renewCosts, 'at', creep.memory.costs, 'and size:' , bodySize);

        targetTicksToLive += creep.memory.renewCount > 0 ? creep.memory.renewCount : 1;
        var creepLink = _.template('<a href="#!/creep/<%= name %>"><%= name %></a>');
        var panel = _.template(
            '<div class="panel panel-default panel-${ type }">'+
                '<div class="panel-heading">'+
                    '<h3 class="panel-title">${ title }</h3>'+
                '</div>'+
                '<div class="panel-body">${ message }</div>'+
            '</div>'
        );
        var progress = _.template(
        '<div class="progress" style="width: 100%; float: left;">' +
            '<div class="progress-bar progress-bar-info progress-bar-striped" style="width: ${ percent }%; min-width: 4em;" role="progressbar" aria-valuenow="${ value }" aria-valuemin="${ min }" aria-valuemax="${ max }" >'+
                '${ value } / ${ max }'+
            '</div>'+
        '</div>'
        );

        var percent = Math.floor(creep.ticksToLive / (targetTicksToLive/100));

        console.log(
            panel({
                type: 'info',
                title: 'Renewing ' + creep.name,
                message:
                    '<style> table td { border: 1px solid red; }</style><table>'+
                        '<tr><td><strong>Ticks</strong></td><td>' + creep.ticksToLive + '</td></tr>'+
                        '<tr><td><strong>TargetTicks</strong></td><td>' + targetTicksToLive + '</td></tr>'+
                    '</table>'+
                    progress({value: creep.ticksToLive, percent: percent, min:0, max: targetTicksToLive})
            })
        );

        //console.log('<span style="background-color: blue;" class="btn">renew</span>:', creepLink(creep), ' - ticks:', creep.ticksToLive, ' - targetTicks:', targetTicksToLive);

        if (!creep.memory.renew) {
            creep.memory.renew = {
                count: creep.memory.renewcount || 0,
                hits: creep.memory.renewHits || 0,
                costs: creep.memory.renewCosts || 0,
                average: [
                    creep.memory.costs / CREEP_LIFE_TIME,
                    0
                ]
            }
        }

        if (creep.memory.renew.costs > creep.memory.costs) {
            console.log(panel({
                type: 'warning',
                title: 'Recycle ' + creep.name,
                message: 'Recycle creep insteed of renew!' +
                '<br>creep.memory.renew.costs: ' + creep.memory.renew.costs +
                '<br>creep.memory.costs: ' + creep.memory.costs
            }));
            creep.memory.role = 'recycle';
            return false;
        }

        var renewd = spawn.renewCreep(creep);
        var unload = creep.transfer(spawn, RESOURCE_ENERGY);

        if (renewd == ERR_NOT_IN_RANGE) {
            creep.sayDelay('renewing', 5);
            creep.moveTo(spawn);
        }

        if (renewd == OK) {
            if (!creep.memory.renew.average) {
                creep.memory.renew.average = [];
            }
            creep.memory.renew.costs += renewCosts;
            creep.memory.renew.hits += renewHits;

            creep.memory.renew.average[1] = renewCosts / renewHits;
            if (creep.ticksToLive > targetTicksToLive || creep.ticksToLive > targetTicksToLive) {
                creep.memory.renew.count++;
                creep.memory.role = creep.memory.origin;
                creep.say('r:' + creep.memory.renew.count + ':' + creep.ticksToLive);

                console.log(_.pairs(creep.memory.renew));
            }
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
