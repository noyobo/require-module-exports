import * as path from 'node:path';
import { loadModuleFile, requireModuleFile } from '../src/index';

describe('index', () => {
  describe('require-module-exports', () => {
    it('basic', async () => {
      expect(requireModuleFile(path.join(__dirname, './fixtures/a.js'))).toMatchSnapshot();
      expect(loadModuleFile(path.join(__dirname, './fixtures/b.ts'))).toMatchSnapshot();
    });
  });
});
