_ = require('lodash'); // "Game" Situation
var mockery = require('mockery');
var chai = require('chai');
var expect = chai.expect;

var emailLogger = require('./../src/data.logger.email');

Game = {
    called: false,
    notify: function(message, type) {
        expect(message).is.equal('test');
        expect(type).is.equal('unit');
        this.called = true;
    }
}

describe('EmailLogger', function() {
     before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
    });

    it('should exists and be a object', () => {
        expect(emailLogger).exist;
        expect(emailLogger).be.an('object');
    });

    it('should have a log method',() => {
        expect(emailLogger.log).exist;
        expect(emailLogger.log).is.an('function');
    });

    it('should call Game.notify method with message and type as groupIntervall', () => {
        emailLogger.log('unit', 'test');
        expect(Game.called).is.ok;
    });

    after(() => {
        mockery.disable();
    });
});
