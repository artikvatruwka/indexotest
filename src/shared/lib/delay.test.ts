import { delay } from './delay';

jest.useFakeTimers();

describe('delay', () => {
  it('resolves after the given time', async () => {
    let resolved = false;
    const promise = delay(500).then(() => {
      resolved = true;
    });

    expect(resolved).toBe(false);
    jest.advanceTimersByTime(500);
    await promise;
    expect(resolved).toBe(true);
  });
});
