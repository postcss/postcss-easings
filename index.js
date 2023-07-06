let parser = require('postcss-value-parser')

const EASINGS = {
  easeInBack: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
  easeInCirc: 'cubic-bezier(0.55, 0, 1, 0.45)',
  easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
  easeInExpo: 'cubic-bezier(0.7, 0, 0.84, 0)',
  easeInOutBack: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  easeInOutCirc: 'cubic-bezier(0.85, 0, 0.15, 1)',
  easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  easeInOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)',
  easeInOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',
  easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  easeInOutQuint: 'cubic-bezier(0.83, 0, 0.17, 1)',
  easeInOutSine: 'cubic-bezier(0.37, 0, 0.63, 1)',
  easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
  easeInQuart: 'cubic-bezier(0.5, 0, 0.75, 0)',
  easeInQuint: 'cubic-bezier(0.64, 0, 0.78, 0)',
  easeInSine: 'cubic-bezier(0.12, 0, 0.39, 0)',
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeOutCirc: 'cubic-bezier(0, 0.55, 0.45, 1)',
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeOutQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeOutSine: 'cubic-bezier(0.61, 1, 0.88, 1)'
}

function toSnake (str) {
  return str.replace(/[A-Z]/g, letter => {
    return '-' + letter.toLowerCase()
  })
}

function toCamel (str) {
  return str.replace(/-(.)/g, letter => {
    return letter[1].toUpperCase()
  })
}

for (let camel of Object.keys(EASINGS)) {
  EASINGS[toSnake(camel)] = EASINGS[camel]
}

const EASING_NAME = /^ease([\w-]+)$/

module.exports = (opts = {}) => {
  let locals = {}
  if (opts.easings) {
    for (let name in opts.easings) {
      if (!EASING_NAME.test(name)) {
        throw new Error(
          `Custom easing ${name} has bad name. ` +
            'Name should start with `ease` and contain ' +
            'only letters, numbers, underscore and dashes'
        )
      }
      locals[name] = opts.easings[name]
      if (name.includes('-')) {
        locals[toCamel(name)] = opts.easings[name]
      } else if (/[A-Z]/.test(name)) {
        locals[toSnake(name)] = opts.easings[name]
      }
    }
  }

  return {
    Declaration (decl) {
      if (!decl.value.includes('ease')) return
      let root = parser(decl.value)
      let changed = false
      root.nodes = root.nodes.map(node => {
        let value = node.value
        if (node.type === 'word' && EASING_NAME.test(value)) {
          if (locals[value] || EASINGS[value]) {
            changed = true
            node.value = locals[value] || EASINGS[value]
          }
        }
        return node
      })
      if (changed) {
        decl.value = root.toString()
      }
    },
    postcssPlugin: 'postcss-easings'
  }
}
module.exports.postcss = true

module.exports.easings = EASINGS
