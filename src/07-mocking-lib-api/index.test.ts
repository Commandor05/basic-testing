// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const mocData = 'mock data';
const relativePath = '/api-test-data';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');
    const axiosClientGetSpy = jest.spyOn(axios.Axios.prototype, 'get');
    const baseURL = 'https://jsonplaceholder.typicode.com';

    axiosClientGetSpy.mockImplementation(async () => ({ data: mocData }));

    await throttledGetDataFromApi(relativePath);
    expect(axiosCreateSpy).toHaveBeenCalledWith({ baseURL: baseURL });
  });

  test('should perform request to correct provided url', async () => {
    const axiosClientGetSpy = jest.spyOn(axios.Axios.prototype, 'get');

    axiosClientGetSpy.mockImplementation(async () => ({ data: mocData }));
    await throttledGetDataFromApi(relativePath);
    jest.runAllTimers();
    expect(axiosClientGetSpy).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const axiosClientGetSpy = jest.spyOn(axios.Axios.prototype, 'get');

    axiosClientGetSpy.mockImplementation(async () => ({ data: mocData }));
    const response = await throttledGetDataFromApi(relativePath);
    jest.runAllTimers();
    expect(response).toBe(mocData);
  });
});
