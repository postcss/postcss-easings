var postcss = require('postcss');

var easings = require('./');

function run(input, output, opts) {
    return postcss([ easings(opts) ]).process(input).then(result => {
        expect(result.css).toEqual(output);
        expect(result.warnings().length).toBe(0);
    });
}

it('replaces easings by camel case name', () => {
    return run(
        'a { transition: all 1s easeInSine }',
        'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }'
    );
});

it('parses regular functions', () => {
    return run(
        'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }',
        'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }'
    );
});

it('ignores unknown names', () => {
    return run(
        'a { transition: all 1s easeInSine1 }',
        'a { transition: all 1s easeInSine1 }'
    );
});

it('replaces easings by snake case name', () => {
    return run(
        'a { transition: all 1s ease-in-sine }',
        'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }'
    );
});

it('replaces multiple easings in out value', () => {
    return run(
        'a { transition: ease-in-sine, easeInOutExpo }',
        'a { transition: cubic-bezier(0.47, 0, 0.745, 0.715), ' +
                        'cubic-bezier(1, 0, 0, 1) }'
    );
});

it('allows to add custom easings', () => {
    return run(
        'a { transition: ease-my, easeMy }',
        'a { transition: 1, 1 }',
        { easings: { easeMy: '1' } }
    );
});

it('allows to add custom easings with snake name', () => {
    return run(
        'a { transition: ease-my, easeMy }',
        'a { transition: 1, 1 }',
        { easings: { 'ease-my': '1' } }
    );
});

it('allows to add custom easings without separation', () => {
    return run(
        'a { transition: easemy }',
        'a { transition: 1 }',
        { easings: { easemy: '1' } }
    );
});

it('checks custom easings name', () => {
    expect(() => {
        easings({ easings: { my: '1' } });
    }).toThrowError(/^Custom easing my has bad name/);
});

it('exports easings', () => {
    expect(easings.easings.easeInSine).toEqual(
        'cubic-bezier(0.47, 0, 0.745, 0.715)');
});
