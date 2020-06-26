import { CiPipe } from './ci.pipe';

describe('CiPipe', () => {
  it('create an instance', () => {
    const pipe = new CiPipe();
    expect(pipe).toBeTruthy();
  });
});
