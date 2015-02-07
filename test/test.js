var postcss = require('postcss');
var expect  = require('chai').expect;
var path    = require('path');

var easings = require('../');

var test = function (input, output, opts) {
    expect(postcss(easings(opts)).process(input).css).to.eql(output);
};

describe('postcss-easings', function () {

});
