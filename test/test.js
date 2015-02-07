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

    it('replaces multiple easings in out value', function () {
        test('a { transition: ease-in-sine, easeInOutExpo }',
             'a { transition: cubic-bezier(0.47, 0, 0.745, 0.715), ' +
                             'cubic-bezier(1, 0, 0, 1) }');
    });

    it('allows to add custom easings', function () {
        test('a { transition: ease-my, easeMy }',
             'a { transition: 1, 1 }',
             { easings: { easeMy: '1' } });
    });

    it('allows to add custom easings with snake name', function () {
        test('a { transition: ease-my, easeMy }',
             'a { transition: 1, 1 }',
             { easings: { 'ease-my': '1' } });
    });

    it('checks custom easings name', function () {
        expect(function () {
            easings({ easings: { my: '1' } });
        }).to.throw(/^Custom easing my has bad name/);
    });

    it('exports easings', function () {
        expect(easings.easings.easeInSine)
            .to.eql('cubic-bezier(0.47, 0, 0.745, 0.715)');
    });

});
