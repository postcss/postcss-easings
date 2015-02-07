var postcss = require('postcss');
var expect  = require('chai').expect;
var path    = require('path');

var easings = require('../');

var test = function (input, output, opts) {
    expect(postcss(easings(opts)).process(input).css).to.eql(output);
};

describe('postcss-easings', function () {

    it('replaces easings by camel case name', function () {
        test('a { transition: all 1s easeInSine }',
             'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }');
    });

    it('replaces easings by snake case name', function () {
        test('a { transition: all 1s ease-in-sine }',
             'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }');
    });

});
