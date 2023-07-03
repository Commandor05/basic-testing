// Uncomment the code below and write your tests
import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = 'test';
    await expect(resolveValue(value)).resolves.toBe(value);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const msg = 'Error test message';
    expect(() => throwError(msg)).toThrow(msg);
  });

  test('should throw error with default message if message is not provided', () => {
    const defaultMsg = 'Oops!';
    expect(() => throwError()).toThrow(defaultMsg);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    const customErrorMsg = new MyAwesomeError().message;
    expect(() => throwCustomError()).toThrow(customErrorMsg);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    const customErrorMsg = new MyAwesomeError().message;
    await expect(() => rejectCustomError()).rejects.toThrow(customErrorMsg);
  });
});
