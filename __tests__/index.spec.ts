import * as path from 'node:path';
import { loadModuleFile, requireModuleCode, requireModuleFile } from '../src';
import {describe, it, expect} from 'vitest';

describe('index', () => {
  describe('require-module-exports', () => {
    it('basic', async () => {
      expect(requireModuleFile(path.join(__dirname, './fixtures/a.js'))).toMatchInlineSnapshot(`
        {
          "a": 1,
        }
      `);
      expect(loadModuleFile(path.join(__dirname, './fixtures/b.ts'))).toMatchInlineSnapshot(`
        {
          "age": 20,
          "b": "/abc/a.js",
          "name": "b",
          "say": [Function],
        }
      `);
    });
  });

  describe('require-module-code', () => {
    it('basic', async () => {
      const code = `
      export const a = 1;
      export const b = 2;
      `;
      const result = requireModuleCode(code);
      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
    });
  });
});
