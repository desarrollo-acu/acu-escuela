import { DatetimeToStringPipe } from './datetime-to-string.pipe';

describe('DatetimeToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new DatetimeToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
