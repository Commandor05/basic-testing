// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockCallback = jest.fn(() => 'done');
    const spySetTimeout = jest.spyOn(global, 'setTimeout');
    const timeout = 5;
    doStuffByTimeout(mockCallback, timeout);
    expect(spySetTimeout).toHaveBeenCalledTimes(1);
    expect(spySetTimeout).toHaveBeenLastCalledWith(mockCallback, timeout);
  });

  test('should call callback only after timeout', () => {
    const mockCallback = jest.fn(() => 'done');
    const timeout = 5;

    expect.assertions(3);

    expect(mockCallback).not.toBeCalled();

    doStuffByTimeout(mockCallback, timeout);

    jest.advanceTimersByTime(timeout);

    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockCallback = jest.fn(() => 'done');
    const spySetInterval = jest.spyOn(global, 'setInterval');
    const timeout = 5;
    doStuffByInterval(mockCallback, timeout);
    expect(spySetInterval).toHaveBeenCalledTimes(1);
    expect(spySetInterval).toHaveBeenLastCalledWith(mockCallback, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockCallback = jest.fn(() => 'done');
    const spySetInterval = jest.spyOn(global, 'setInterval');
    const timeout = 5;
    const iterationsNumber = 10;
    const iterations = [...Array(iterationsNumber).keys()];

    doStuffByInterval(mockCallback, timeout);
    expect(spySetInterval).toHaveBeenCalledTimes(1);
    expect(spySetInterval).toHaveBeenLastCalledWith(mockCallback, timeout);

    for (const _ of iterations) {
      jest.runOnlyPendingTimers();
      expect(mockCallback).toBeCalled();
      expect(spySetInterval).toHaveBeenCalledTimes(1);
      expect(spySetInterval).toHaveBeenLastCalledWith(mockCallback, timeout);
    }
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = '/pathToFile';
    const joinSpy = jest.spyOn(path, 'join');

    await readFileAsynchronously(pathToFile);

    expect(joinSpy).toHaveBeenCalledTimes(1);
    expect(joinSpy).toHaveBeenLastCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = '/pathToFile';
    const existsSync = jest.spyOn(fs, 'existsSync');

    existsSync.mockReturnValueOnce(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = '/pathToFile';
    const mockFileContent = 'mockFileContent';
    const existsSync = jest.spyOn(fs, 'existsSync');
    const readFile = jest.spyOn(fsPromises, 'readFile');

    readFile.mockResolvedValue(mockFileContent);
    existsSync.mockReturnValueOnce(true);

    const result = await readFileAsynchronously(pathToFile);

    expect(readFile).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockFileContent);
  });
});
