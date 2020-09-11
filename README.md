# PostCSS Easings

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="https://postcss.org/logo-leftp.svg">

[PostCSS] plugin to replace easing name from [easings.net] to `cubic-bezier()`.

[easings.net]: http://easings.net/
[PostCSS]:     https://github.com/postcss/postcss

```css
.snake {
  transition: all 600ms ease-in-sine;
}
.camel {
  transition: all 600ms easeInSine;
}
```

```css
.snake {
  transition: all 600ms cubic-bezier(0.47, 0, 0.745, 0.715);
}
.camel {
  transition: all 600ms cubic-bezier(0.47, 0, 0.745, 0.715);
}
```

<a href="https://evilmartians.com/?utm_source=postcss-easings">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>


## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-easings
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-easings'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage

Also you can get all build-in easings:

```js
require('postcss-easings').easings;
```


## Options

### `easings`

Allow to set custom easings:

```js
    require('postcss-easings')({
      easings: { easeJump: 'cubic-bezier(.86,0,.69,1.57)' }
    })
```

Plugin will convert custom easing name between camelCase and snake-case.
So example below adds `easeJump` and `ease-jump` easings.

Custom easing name must start from `ease` and contain only letters and `-`.

You can create custom easing on [cubic-bezier.com].

[cubic-bezier.com]: http://cubic-bezier.com/
