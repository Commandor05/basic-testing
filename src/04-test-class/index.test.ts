// Uncomment the code below and write your tests
import { getBankAccount } from '.';
import lodash from 'lodash';

jest.mock('lodash');

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const bankAaccount = getBankAccount(initialBalance);
    expect(bankAaccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = 0;
    const bankAaccount = getBankAccount(balance);
    expect(() => bankAaccount.withdraw(100)).toThrowError(
      `Insufficient funds: cannot withdraw more than ${balance}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const balance = 0;
    const transferAmount = 100;
    const sourceBankAaccount = getBankAccount(balance);
    const targetBankAaccount = getBankAccount(balance);
    expect(() =>
      sourceBankAaccount.transfer(transferAmount, targetBankAaccount),
    ).toThrowError();
  });

  test('should throw error when transferring to the same account', () => {
    const balance = 100;
    const transferAmount = 100;
    const sourceBankAaccount = getBankAccount(balance);
    expect(() =>
      sourceBankAaccount.transfer(transferAmount, sourceBankAaccount),
    ).toThrowError('Transfer failed');
  });

  test('should deposit money', () => {
    const initialBalance = 0;
    const depositAmount = 100;
    const bankAaccount = getBankAccount(initialBalance);
    const totalBalance = depositAmount + initialBalance;
    expect(() => bankAaccount.deposit(depositAmount)).not.toThrowError();

    expect(bankAaccount.getBalance()).toBe(totalBalance);
  });

  test('should withdraw money', () => {
    const initialBalance = 100;
    const withdrawAmount = 50;
    const bankAaccount = getBankAccount(initialBalance);
    const totalBalance = initialBalance - withdrawAmount;
    expect(() => bankAaccount.withdraw(withdrawAmount)).not.toThrowError();

    expect(bankAaccount.getBalance()).toBe(totalBalance);
  });

  test('should transfer money', () => {
    const balance = 100;
    const transferAmount = balance / 2;
    const sourceBankAaccount = getBankAccount(balance);
    const targetBankAaccount = getBankAccount(balance);
    const totalSourceBalance = balance - transferAmount;
    const totalTargetBalance = balance + transferAmount;
    expect(() =>
      sourceBankAaccount.transfer(transferAmount, targetBankAaccount),
    ).not.toThrowError();

    expect(sourceBankAaccount.getBalance()).toBe(totalSourceBalance);
    expect(targetBankAaccount.getBalance()).toBe(totalTargetBalance);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const initialBalance = 0;
    const bankAaccount = getBankAccount(initialBalance);

    lodash.random = jest.fn(() => 1);

    expect.assertions(1);
    const balance = await bankAaccount.fetchBalance();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(!isNaN(balance)).toBe(true);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = -100;
    const newBalance = 1000;
    const bankAaccount = getBankAccount(initialBalance);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(bankAaccount, 'fetchBalance').mockResolvedValue(newBalance);

    await bankAaccount.synchronizeBalance();
    const balance = bankAaccount.getBalance();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(!isNaN(balance)).toBe(true);
    expect(balance).not.toBe(initialBalance);
    expect(balance).toBe(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initialBalance = 0;
    const bankAaccount = getBankAccount(initialBalance);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(bankAaccount, 'fetchBalance').mockResolvedValue(null);
    expect.assertions(1);
    try {
      await bankAaccount.synchronizeBalance();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(e.message).toEqual('Synchronization failed');
    }
  });
});
