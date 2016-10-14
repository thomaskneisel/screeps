_ = require('lodash'); // "Game" Situation
var mockery = require('mockery');
var chai = require('chai');
var expect = chai.expect;

var dataSources = require('./../src/data.sources');

Game = Game || {
    rooms: {
    }
}

describe('DataSources', function() {
    it('should exists and be a object', () => {
        expect(dataSources).exist;
        expect(dataSources).is.an('object');
    });
});

