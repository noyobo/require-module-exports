import { join } from 'path';

export default {
  name: 'b',
  age: 20,
  say(v: string) {
    console.log('b say:', v, join(__dirname, 'a.js'));
  },
  b: join('/abc', 'a.js')
};


export const foo = 'foo';
export const bar = 'bar';
export const baz = 'baz';
