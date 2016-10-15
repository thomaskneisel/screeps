var roleRecycle = require('role.recycle')

module.exports = {

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

        if (creep.memory.renew.costs > creep.memory.costs * 2) {
            console.log(panel({
                type: 'warning',
                title: 'Recycle ' + creep.name,
                message: 'Recycle creep insteed of renew!' +
                '<br>creep.memory.renew.costs: ' + creep.memory.renew.costs +
                '<br>creep.memory.costs: ' + creep.memory.costs
            }));
            //creep.memory.role = 'recycle';
            //return false;
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
    }
}
