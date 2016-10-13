_ = require('lodash'); // "Game" Situation
var mockery = require('mockery');
var chai = require('chai');
var expect = chai.expect;

var DataLogger = require('./../src/data.logger');

var methods = ['log', 'success', 'info', 'warn', 'error'];
var loggerMock = {};

describe('DataLogger', function() {
    before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
    });

    beforeEach(function() {
        loggerMock = {
            calledLog: false,
            expectedType: 'mt',
            expectedMsg: 'msg',
            log: function(type, message) {
                expect(type).is.equal(this.expectedType);
                expect(message).is.equal(this.expectedMsg);
                this.calledLog = true;
            }
        };
    });

    it('should be object', () => {
        expect(DataLogger).to.exist;
        expect(DataLogger).to.be.an('object');
    });

    it('should have all log methods', () => {
        _(methods).forEach((methodName) => {
            expect(DataLogger[methodName]).exist;
            expect(DataLogger[methodName]).to.be.an('function')
        });
    });

    it('log should call registerd loggers log method', () => {
        mockery.registerMock('./../src/data.logger', loggerMock);
        var someLogger = require('./../src/data.logger');

        DataLogger.loggers.push(someLogger);
        DataLogger.log('mt', 'msg');

        expect(loggerMock.calledLog).is.ok;

        mockery.deregisterMock('./../src/data.logger');
    });

    it('should use the right log types', () => {
        var methods = ['success', 'info', 'warn', 'error'];

        _(methods).forEach((methodName) => {
            loggerMock.expectedType = DataLogger.logTypes[methodName];
            mockery.registerMock('./../src/data.logger', loggerMock);
            someLogger = require('./../src/data.logger');
            DataLogger.loggers = [someLogger];

            DataLogger[methodName]('msg');

            mockery.deregisterMock('./../src/data.logger');
        });
    });

    // afterEach(() => console.log('End test'));
    after(() => {
        mockery.disable();
   });
});
