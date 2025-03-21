import { buildSync } from 'esbuild';

export function runCjs<T>(code: string) {
  const module = { exports: {} };
  const fn = new Function('module', 'exports', code);
  fn(module, module.exports);
  return module.exports as T;
}

/**
 * transform module file to commonjs module and run it
 * return the exports object
 */
export const requireModuleFile = (filePath: string) => {
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
  return runCjs<Record<string, unknown>>(code);
};

export const requireModuleCode = (inputCode: string) => {
  const result = buildSync({
    stdin: {
      contents: inputCode,
      sourcefile: 'code.js',
      loader: 'ts',
    },
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
