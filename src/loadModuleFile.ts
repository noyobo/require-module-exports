import fs from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { buildSync } from 'esbuild';

function requireModule<T>(filePath: string, code: string) {
  const dir = dirname(filePath);
  const fileName = basename(filePath);
  const ext = extname(fileName);
  const fileBase = `${fileName}.timestamp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const tmpFilePath = join(dir, fileBase + ext);

  // TODO: support .mjs

  fs.writeFileSync(tmpFilePath, code, 'utf-8');
  const exports = require(tmpFilePath);
  fs.unlinkSync(tmpFilePath);

  if (exports.__esModule && 'default' in exports) {
    return exports.default as T;
  }
  return exports as T;
}

/**
 * load module from file, and return the exports at node environment
 */
export const loadModuleFile = (filePath: string) => {
  const result = buildSync({
    entryPoints: [filePath],
    bundle: true,
    minify: true,
    platform: 'node',
    format: 'cjs',
    target: 'es2015',
    sourcemap: false,
    write: false,
  });
  const code = result.outputFiles[0].text;
  return requireModule<Record<string, unknown>>(filePath, code);
};
