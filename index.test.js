let { equal, throws } = require('uvu/assert')
let postcss = require('postcss')
let { test } = require('uvu')

let plugin = require('./')

function run(input, output, opts) {
  let result = postcss([plugin(opts)]).process(input, { from: '/test.css' })
  equal(result.css, output)
  equal(result.warnings().length, 0)
}

test('replaces easings by camel case name', async () => {
  await run(
    'a { transition: all 1s easeInSine }',
    'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }'
  )
})

test('parses regular functions', async () => {
  await run(
    'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }',
    'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }'
  )
})

test('ignores unknown names', async () => {
  await run(
    'a { transition: all 1s easeInSine1 }',
    'a { transition: all 1s easeInSine1 }'
  )
})

test('replaces easings by snake case name', async () => {
  await run(
    'a { transition: all 1s ease-in-sine }',
    'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }'
  )
})

test('replaces multiple easings in out value', async () => {
  await run(
    'a { transition: ease-in-sine, easeInOutExpo }',
    'a { transition: cubic-bezier(0.47, 0, 0.745, 0.715), ' +
      'cubic-bezier(1, 0, 0, 1) }'
  )
})

test('allows to add custom easings', async () => {
  await run('a { transition: ease-my, easeMy }', 'a { transition: 1, 1 }', {
    easings: { easeMy: '1' }
  })
})

test('allows to add custom easings with snake name', async () => {
  await run('a { transition: ease-my, easeMy }', 'a { transition: 1, 1 }', {
    easings: { 'ease-my': '1' }
  })
})

test('allows to add custom easings without separation', async () => {
  await run('a { transition: easemy }', 'a { transition: 1 }', {
    easings: { easemy: '1' }
  })
})

test('checks custom easings name', () => {
  throws(() => {
    plugin({ easings: { my: '1' } })
  }, /^Custom easing my has bad name/)
})

test('exports easings', () => {
  equal(plugin.easings.easeInSine, 'cubic-bezier(0.47, 0, 0.745, 0.715)')
})

test.run()
