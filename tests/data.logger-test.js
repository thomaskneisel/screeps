var _ = require('lodash');
var mockery = require('mockery');
var chai = require('chai');
var expect = chai.expect;
var DataLogger = require('./../src/data.logger');

describe('DataLogger', function() {
    before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        console.log('\tStart Test Suite');
    });
    // beforeEach(() => console.log('Start test'));

    it('should be object', function() {
        expect(DataLogger).to.exist;
        expect(DataLogger).to.be.an('object');
    });

    it('should have all log methods', function() {
        var methods = ['log', 'success', 'info', 'warn', 'error'];
        _(methods).forEach((methodName) => {
            expect(DataLogger[methodName]).exist;
            expect(DataLogger[methodName]).to.be.an('function')
        });
    });

    // afterEach(() => console.log('End test'));
    after(() => {
        mockery.disable();
        console.log('End Test Suite');
    });
});
