import fs from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { buildSync } from 'esbuild';

export function runCjs<T>(filePath: string, code: string) {
  const dir = dirname(filePath);
  const fileName = basename(filePath);
  const ext = extname(fileName);
  const fileBase = `${fileName}.timestamp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const tmpFilePath = join(dir, fileBase + ext);

  // TODO: support .mjs

  fs.writeFileSync(tmpFilePath, code, 'utf-8');
  const exports = require(tmpFilePath);
  fs.unlinkSync(tmpFilePath);

  if (exports.__esModule) {
    return exports.default as T;
  }
  return exports as T;
}

/**
 * 读取并运行文件
 */
export const requireModuleExports = (filePath: string) => {
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
  return runCjs<Record<string, unknown>>(filePath, code);
};
