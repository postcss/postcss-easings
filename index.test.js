let postcss = require('postcss')

let easings = require('./')

async function run (input, output, opts) {
  let result = await postcss([easings(opts)]).process(input, {
    from: undefined
  })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('replaces easings by camel case name', async () => {
  await run(
    'a { transition: all 1s easeInSine }',
    'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }'
  )
})

it('parses regular functions', async () => {
  await run(
    'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }',
    'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }'
  )
})

it('ignores unknown names', async () => {
  await run(
    'a { transition: all 1s easeInSine1 }',
    'a { transition: all 1s easeInSine1 }'
  )
})

it('replaces easings by snake case name', async () => {
  await run(
    'a { transition: all 1s ease-in-sine }',
    'a { transition: all 1s cubic-bezier(0.47, 0, 0.745, 0.715) }'
  )
})

it('replaces multiple easings in out value', async () => {
  await run(
    'a { transition: ease-in-sine, easeInOutExpo }',
    'a { transition: cubic-bezier(0.47, 0, 0.745, 0.715), ' +
      'cubic-bezier(1, 0, 0, 1) }'
  )
})

it('allows to add custom easings', async () => {
  await run('a { transition: ease-my, easeMy }', 'a { transition: 1, 1 }', {
    easings: { easeMy: '1' }
  })
})

it('allows to add custom easings with snake name', async () => {
  await run('a { transition: ease-my, easeMy }', 'a { transition: 1, 1 }', {
    easings: { 'ease-my': '1' }
  })
})

it('allows to add custom easings without separation', async () => {
  await run('a { transition: easemy }', 'a { transition: 1 }', {
    easings: { easemy: '1' }
  })
})

it('checks custom easings name', () => {
  expect(() => {
    easings({ easings: { my: '1' } })
  }).toThrow(/^Custom easing my has bad name/)
})

it('exports easings', () => {
  expect(easings.easings.easeInSine).toEqual(
    'cubic-bezier(0.47, 0, 0.745, 0.715)'
  )
})
