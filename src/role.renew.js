var roleRecycle = require('role.recycle')
var roleHarvester = require('role.harvester')
var roleInvader = require('role.invader')

var roleRenew = {

    /** @param {Creep} creep
     *  @param {Integer} ticksToLive
     *  @param {Spawn} spawn
     */
    run: function(creep, targetTicksToLive, spawn) {
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
                    progress({value: creep.ticksToLive, percent: percent, min:0, max: targetTicksToLive})})
        );

        //console.log('<span style="background-color: blue;" class="btn">renew</span>:', creepLink(creep), ' - ticks:', creep.ticksToLive, ' - targetTicks:', targetTicksToLive);

        var renewd = spawn.renewCreep(creep);
        var unload = creep.transfer(spawn, RESOURCE_ENERGY);

        if (!creep.memory.renew) {
            creep.memory.renew = {
                count: creep.memory.renewcount || 0,
                hits: creep.memory.renewHits || 0,
                costs: creep.memory.renewCosts || 0,
                average: [
                    creep.memory.costs / CREEP_LIFE_TIME
                ]
            }
            var renew = creep.memory.renew;
            renew.average.push( renew.costs / renew.hits);

            console.log(creep.memory.renew.average);
        }

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

            creep.memory.renew.average.push(renewCosts / renewHits);

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

module.exports = roleRenew;
