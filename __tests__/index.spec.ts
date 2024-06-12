import * as path from 'node:path';
import { requireModuleExports } from '../src/index';

describe('index', () => {
  describe('require-module-exports', () => {
    it('basic', async () => {
      expect(
        requireModuleExports(path.join(__dirname, './fixtures/a.js')),
      ).toMatchSnapshot();
      expect(
        requireModuleExports(path.join(__dirname, './fixtures/b.ts')),
      ).toMatchSnapshot();
    });
  });
});
