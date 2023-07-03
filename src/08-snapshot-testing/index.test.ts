// Uncomment the code below and write your tests
import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const list = ['list item 1', 'list item 2'];
    const obj = {
      value: 'list item 1',
      next: { value: 'list item 2', next: { value: null, next: null } },
    };
    const result = generateLinkedList(list);

    expect(obj).toStrictEqual(result);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const list = [1, 2];
    const result = generateLinkedList(list);

    expect(result).toMatchSnapshot();
  });
});
