_ = require('lodash'); // "Game" Situation
var mockery = require('mockery');
var chai = require('chai');
var expect = chai.expect;

var logger = require('./../src/data.logger.logger');

var loggerMock = {};

describe('Logger', function() {
    it('should exists and be a object', () =>
        expect(logger).exits;
        expect(logger).to.be.an('object');
    );
});
