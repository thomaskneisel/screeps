_ = require('lodash'); // "Game" Situation
var chai = require('chai');
var expect = chai.expect;

var Logger = require('./../src/data.logger.logger');

var loggerMock = {};

describe('Logger', function() {
    it('should exists and be a object with constructor', () => {
        expect(Logger).exist;
        expect(Logger).be.an('function');
    });

    it('instance should be a object ', () => {
        var logger = new Logger();
        expect(logger).is.an('object');
    });

    it('should exists and be a object with constructor', () => {
        expect(Logger).exist;
        expect(Logger).be.an('function');
        var logger = new Logger();
        expect(logger).is.an('object');
    });

    it('should have a log method',() => {
        var logger = new Logger();
        expect(logger.log).exist;
        expect(logger.log).is.an('function');
    });
});
