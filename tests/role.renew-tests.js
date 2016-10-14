_ = require('lodash'); // "Game" Situation

var mockery = require('mockery');
var chai = require('chai');
var expect = chai.expect;

describe('Role.Renew', function() {
    var renew;

    mock = {};

    before(() => {
        mockery.registerMock('role.recycle', mock);
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
    });

    beforeEach(() => {
        renew = require('./../src/role.renew');
    });

    it('should be a object', () => {
        expect(renew).exist;
        expect(renew).is.an('object')
    });

    it('should have a renew function', () => {
        expect(renew.renew).exist;
        expect(renew.renew).is.an('function');
    });
});

