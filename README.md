# require-module-exports

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]

Require `module.exports` or `exports` from file. This library allows you to dynamically load and execute module files (ES modules, TypeScript, or CommonJS) and get their exports in a CommonJS environment.


[中文 README](./README.zh.md)

## Features

- ✅ Support ES modules (`export`, `export default`)
- ✅ Support CommonJS modules (`module.exports`, `exports`)
- ✅ Support TypeScript files (`.ts`)
- ✅ Support JavaScript files (`.js`, `.mjs`)
- ✅ Bundle dependencies automatically
- ✅ Works in pure CommonJS environments
- ✅ Works in Node.js environments

## Installation

```bash
npm install require-module-exports
# or
pnpm add require-module-exports
# or
yarn add require-module-exports
```

## API

### `requireModuleFile(filePath: string)`

Transform a module file to CommonJS and execute it in a pure CommonJS environment. Returns the exports object.

**Parameters:**
- `filePath` (string): Path to the module file (supports `.js`, `.ts`, etc.)

**Returns:**
- `Record<string, unknown>`: The exports object from the module

**Example:**

```js
const { requireModuleFile } = require('require-module-exports');

// Load a CommonJS module
const cjsModule = requireModuleFile('./path/to/file.js');
console.log(cjsModule); // { a: 1 }

// Load an ES module
const esModule = requireModuleFile('./path/to/module.ts');
console.log(esModule); // { default: {...}, named: 'export' }
```

### `loadModuleFile(filePath: string)`

Load a module file in Node.js environment. This function uses Node.js `require()` internally, so it has access to Node.js built-in modules and can handle `__dirname`, `__filename`, etc.

**Parameters:**
- `filePath` (string): Path to the module file (supports `.js`, `.ts`, etc.)

**Returns:**
- `Record<string, unknown>`: The exports object from the module. If the module is an ES module with `default` export, returns the default export directly.

**Example:**

```js
const { loadModuleFile } = require('require-module-exports');

// Load a TypeScript module with default export
const moduleExports = loadModuleFile('./path/to/file.ts');
console.log(moduleExports); // { name: 'b', age: 20, say: [Function] }
```

### `requireModuleCode(inputCode: string)`

Execute code string directly and return the exports. Useful for dynamic code execution.

**Parameters:**
- `inputCode` (string): The code string to execute (supports TypeScript syntax)

**Returns:**
- `Record<string, unknown>`: The exports object from the executed code

**Example:**

```js
const { requireModuleCode } = require('require-module-exports');

const code = `
  export const a = 1;
  export const b = 2;
  export function add(x, y) {
    return x + y;
  }
`;

const result = requireModuleCode(code);
console.log(result.a); // 1
console.log(result.b); // 2
console.log(result.add(3, 4)); // 7
```

## Usage Examples

### Example 1: Loading a CommonJS Module

**file.js:**
```js
module.exports = {
  name: 'MyModule',
  version: '1.0.0',
  greet: function(name) {
    return `Hello, ${name}!`;
  }
};
```

**usage.js:**
```js
const { requireModuleFile } = require('require-module-exports');

const myModule = requireModuleFile('./file.js');
console.log(myModule.name); // 'MyModule'
console.log(myModule.greet('World')); // 'Hello, World!'
```

### Example 2: Loading an ES Module

**module.ts:**
```ts
export const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

export default {
  name: 'App',
  version: '2.0.0'
};

export function getConfig() {
  return config;
}
```

**usage.js:**
```js
const { requireModuleFile } = require('require-module-exports');

const moduleExports = requireModuleFile('./module.ts');
console.log(moduleExports.default); // { name: 'App', version: '2.0.0' }
console.log(moduleExports.config); // { apiUrl: '...', timeout: 5000 }
console.log(moduleExports.getConfig()); // Function
```

### Example 3: Using `loadModuleFile` with Node.js Features

**app.ts:**
```ts
import { join } from 'path';

export default {
  name: 'MyApp',
  getPath: () => join(__dirname, 'data'),
  say: (message: string) => {
    console.log(`App says: ${message}`);
  }
};
```

**usage.js:**
```js
const { loadModuleFile } = require('require-module-exports');

const app = loadModuleFile('./app.ts');
console.log(app.name); // 'MyApp'
console.log(app.getPath()); // '/path/to/data'
app.say('Hello'); // 'App says: Hello'
```

### Example 4: Dynamic Code Execution

```js
const { requireModuleCode } = require('require-module-exports');

// Generate code dynamically
const userCode = `
  export const user = {
    name: 'John',
    age: 30
  };
  
  export function getInfo() {
    return \`\${user.name} is \${user.age} years old\`;
  }
`;

const result = requireModuleCode(userCode);
console.log(result.user); // { name: 'John', age: 30 }
console.log(result.getInfo()); // 'John is 30 years old'
```

### Example 5: Loading TypeScript Modules with Dependencies

**utils.ts:**
```ts
import { readFileSync } from 'fs';

export function readConfig(path: string) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export default {
  version: '1.0.0',
  env: process.env.NODE_ENV || 'development'
};
```

**usage.js:**
```js
const { loadModuleFile } = require('require-module-exports');

const utils = loadModuleFile('./utils.ts');
console.log(utils.version); // '1.0.0'
console.log(utils.readConfig('./config.json')); // Parsed JSON
```

## Differences Between Functions

| Function | Environment | Node.js Features | ES Module Default Export |
|----------|------------|------------------|-------------------------|
| `requireModuleFile` | Pure CommonJS | ❌ | Returns as `default` property |
| `loadModuleFile` | Node.js | ✅ (`__dirname`, `require`, etc.) | Returns default export directly |
| `requireModuleCode` | Pure CommonJS | ❌ | Returns as `default` property |

## When to Use Which Function?

- **Use `requireModuleFile`**: When you need a pure CommonJS environment without Node.js-specific features, or when you want to keep ES module default exports as a `default` property.

- **Use `loadModuleFile`**: When you need Node.js features like `__dirname`, `__filename`, `require()`, or when you want ES module default exports to be returned directly (not wrapped in a `default` property).

- **Use `requireModuleCode`**: When you have code as a string and want to execute it dynamically, useful for code generation or plugin systems.

## Requirements

- Node.js >= 12.0

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


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
