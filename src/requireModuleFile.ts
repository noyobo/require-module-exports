import { buildSync } from 'esbuild';

export function runCjs<T>(
  code: string,
  exportNames: string | string[] = 'default',
): T {
  const module = { exports: {} };
  const fn = new Function('module', 'exports', code);
  fn(module, module.exports);
  const mod = module.exports as T;

  if (Array.isArray(exportNames)) {
    return exportNames.reduce((acc, key) => {
      (acc as Record<string, unknown>)[key] = (mod as Record<string, unknown>)[
        key
      ];
      return acc;
    }, {} as T);
  }

  if (exportNames === 'default') {
    // @ts-ignore
    if (mod?.__esModule) {
      // @ts-ignore
      return mod.default;
    }
  }
  return mod;
}

/**
 * transform module file to commonjs module and run it
 * return the exports object
 */
export const requireModuleFile = (
  filePath: string,
  exportNames: string | string[] = 'default',
) => {
  const result = buildSync({
    entryPoints: [filePath],
    bundle: true,
    minify: true,
    format: 'cjs',
    target: 'es2015',
    sourcemap: false,
    write: false,
  });
  const code = result.outputFiles[0].text;
  return runCjs<Record<string, unknown>>(code, exportNames);
};
