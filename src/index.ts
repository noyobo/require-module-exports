import { buildSync } from 'esbuild';

export function runCjs<T>(code: string) {
  const module = { exports: {} };
  const fn = new Function('module', 'exports', code);
  fn(module, module.exports);
  const mod = module.exports as T;

  // @ts-ignore
  if (mod?.__esModule) {
    // @ts-ignore
    return mod.default;
  }
  return mod;
}

/**
 * 读取并运行文件
 */
export const requireModuleExports = (filename: string) => {
  const result = buildSync({
    entryPoints: [filename],
    bundle: true,
    minify: true,
    format: 'cjs',
    target: 'es2015',
    sourcemap: false,
    write: false,
  });
  const code = result.outputFiles[0].text;
  return runCjs<Record<string, unknown>>(code);
};
