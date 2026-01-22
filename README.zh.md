# require-module-exports

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]

从文件中加载 `module.exports` 或 `exports`。该库允许你在 CommonJS 环境中动态加载和执行模块文件（ES 模块、TypeScript 或 CommonJS）并获取其导出内容。

[English README](./README.md)

## 特性

- ✅ 支持 ES 模块 (`export`, `export default`)
- ✅ 支持 CommonJS 模块 (`module.exports`, `exports`)
- ✅ 支持 TypeScript 文件 (`.ts`)
- ✅ 支持 JavaScript 文件 (`.js`, `.mjs`)
- ✅ 自动打包依赖
- ✅ 在纯 CommonJS 环境中工作
- ✅ 在 Node.js 环境中工作

## 安装

```bash
npm install require-module-exports
# 或
pnpm add require-module-exports
# 或
yarn add require-module-exports
```

## API

### `requireModuleFile(filePath: string)`

将模块文件转换为 CommonJS 并在纯 CommonJS 环境中执行。返回导出对象。

**参数：**
- `filePath` (string): 模块文件路径（支持 `.js`、`.ts` 等）

**返回值：**
- `Record<string, unknown>`: 模块的导出对象

**示例：**

```js
const { requireModuleFile } = require('require-module-exports');

// 加载 CommonJS 模块
const cjsModule = requireModuleFile('./path/to/file.js');
console.log(cjsModule); // { a: 1 }

// 加载 ES 模块
const esModule = requireModuleFile('./path/to/module.ts');
console.log(esModule); // { default: {...}, named: 'export' }
```

### `loadModuleFile(filePath: string)`

在 Node.js 环境中加载模块文件。此函数内部使用 Node.js 的 `require()`，因此可以访问 Node.js 内置模块，并能处理 `__dirname`、`__filename` 等。

**参数：**
- `filePath` (string): 模块文件路径（支持 `.js`、`.ts` 等）

**返回值：**
- `Record<string, unknown>`: 模块的导出对象。如果模块是带有 `default` 导出的 ES 模块，则直接返回默认导出。

**示例：**

```js
const { loadModuleFile } = require('require-module-exports');

// 加载带有默认导出的 TypeScript 模块
const moduleExports = loadModuleFile('./path/to/file.ts');
console.log(moduleExports); // { name: 'b', age: 20, say: [Function] }
```

### `requireModuleCode(inputCode: string)`

直接执行代码字符串并返回导出。适用于动态代码执行。

**参数：**
- `inputCode` (string): 要执行的代码字符串（支持 TypeScript 语法）

**返回值：**
- `Record<string, unknown>`: 执行代码后的导出对象

**示例：**

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

## 使用示例

### 示例 1: 加载 CommonJS 模块

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

### 示例 2: 加载 ES 模块

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

### 示例 3: 使用 `loadModuleFile` 配合 Node.js 特性

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

### 示例 4: 动态代码执行

```js
const { requireModuleCode } = require('require-module-exports');

// 动态生成代码
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

### 示例 5: 加载带依赖的 TypeScript 模块

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
console.log(utils.readConfig('./config.json')); // 解析后的 JSON
```

## 函数之间的区别

| 函数 | 环境 | Node.js 特性 | ES 模块默认导出 |
|------|------|-------------|----------------|
| `requireModuleFile` | 纯 CommonJS | ❌ | 作为 `default` 属性返回 |
| `loadModuleFile` | Node.js | ✅ (`__dirname`, `require` 等) | 直接返回默认导出 |
| `requireModuleCode` | 纯 CommonJS | ❌ | 作为 `default` 属性返回 |

## 何时使用哪个函数？

- **使用 `requireModuleFile`**：当你需要在没有 Node.js 特定功能的纯 CommonJS 环境中运行，或者希望将 ES 模块的默认导出保留为 `default` 属性时。

- **使用 `loadModuleFile`**：当你需要 Node.js 特性（如 `__dirname`、`__filename`、`require()`），或者希望 ES 模块的默认导出直接返回（不包装在 `default` 属性中）时。

- **使用 `requireModuleCode`**：当你拥有代码字符串并希望动态执行它时，适用于代码生成或插件系统。

## 系统要求

- Node.js >= 12.0

## 许可证

MIT

## 贡献

欢迎贡献！请随时提交 Pull Request。


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
