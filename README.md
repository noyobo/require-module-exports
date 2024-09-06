# require-module-exports

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]

require `module.exports` or `exports` from file

## Usage 

Pure commonjs module

```js
const { requireModuleFile } = require('require-module-exports');

const moduleExports = requireModuleFile('./path/to/file.js');
```

Nodejs environment module

```js
const { loadModuleFile } = require('require-module-exports');

const moduleExports = loadModuleFile('./path/to/file.js');
```


[build-img]: https://github.com/noyobo/require-module-exports/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/noyobo/require-module-exports/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/require-module-exports
[downloads-url]: https://www.npmtrends.com/require-module-exports
[npm-img]: https://img.shields.io/npm/v/require-module-exports
[npm-url]: https://www.npmjs.com/package/require-module-exports
[issues-img]: https://img.shields.io/github/issues/noyobo/require-module-exports
[issues-url]: https://github.com/noyobo/require-module-exports/issues
[codecov-img]: https://codecov.io/gh/noyobo/require-module-exports/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/noyobo/require-module-exports
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
