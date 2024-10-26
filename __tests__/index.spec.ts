import * as PATH from 'node:path';
import { loadModuleFile, requireModuleFile } from '../src/index';


describe('index', () => {
  describe('require-module-exports', () => {
    it('basic', async () => {
      expect(requireModuleFile(PATH.join(__dirname, './fixtures/a.js'))).toMatchSnapshot();
      expect(loadModuleFile(PATH.join(__dirname, './fixtures/b.ts'))).toMatchSnapshot();
    });

    it('basic export names cjs', async () => {
      expect(requireModuleFile(PATH.join(__dirname, './fixtures/c.js'), ['foo', 'bar'])).toMatchSnapshot();
      expect(requireModuleFile(PATH.join(__dirname, './fixtures/c.js'))).toMatchSnapshot();
    });

    it('basic export names esm', async () => {
      expect(loadModuleFile(PATH.join(__dirname, './fixtures/b.ts'), ['foo', 'bar'])).toMatchSnapshot();
    });
  });
});
