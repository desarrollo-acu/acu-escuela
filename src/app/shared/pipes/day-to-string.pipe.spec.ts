import { DayToStringPipe } from './day-to-string.pipe';

describe('DayToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new DayToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
