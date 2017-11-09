// @flow

import { createSelector } from 'reselect';
import formatAmount from 'utils/formatAmount';
import memoize from 'fast-memoize';
import type { State } from 'modules/rootReducer';
import type { Transaction } from 'modules/transactions';
import { getCategories } from './categories';
import get from 'lodash/get';

export type TransactionSummary = {
  categoryId: string,
  value: number,
  category?: string,
};

function totalTransactions(transactions: Transaction[]): number {
  return transactions.reduce((total, item) => total + parseFloat(item.value), 0);
}

function summarizeTransactions(transactions: Transaction[]): TransactionSummary[] {
  return transactions.reduce((summary, { categoryId, value }) => {
    const sum =
      summary.find(item => item.categoryId === categoryId) || summary[summary.push({ categoryId, value: 0 }) - 1];

    sum.value += Math.abs(value);
    return summary;
  }, []);
}

export const sortTransactions = <T: { value: number }>(transactions: T[]): T[] => {
  const unsorted = [...transactions];
  return unsorted.sort((a, b) => b.value - a.value);
};

const applyCategoryName = (transactions: TransactionSummary[], categories) =>
  transactions.map(transaction => {
    transaction.category = categories[transaction.categoryId];
    return transaction;
  });

export const getTransactions = (state: State): Transaction[] => state.transactions || [];

export const getTransactionById = memoize(id =>
  createSelector([getTransactions], transactions => transactions.find(item => item.id === parseInt(id, 10)))
);

const getInflowTransactions = createSelector([getTransactions], transactions =>
  transactions.filter(item => item.value > 0)
);

const getOutflowTransactions = createSelector([getTransactions], transactions =>
  transactions.filter(item => item.value < 0)
);

const getBalance = createSelector([getTransactions], transactions => totalTransactions(transactions));

export const getInflowBalance = createSelector([getInflowTransactions], transactions =>
  totalTransactions(transactions)
);

export const getOutflowBalance = createSelector([getOutflowTransactions], transactions =>
  totalTransactions(transactions)
);

export const getFormattedBalance = createSelector([getBalance], amount => formatAmount(amount, false));

export const getFormattedInflowBalance = createSelector([getInflowBalance], amount => formatAmount(amount, false));

export const getFormattedOutflowBalance = createSelector([getOutflowBalance], amount => formatAmount(amount, false));

const getOutflowByCategory = createSelector([getOutflowTransactions], transactions =>
  summarizeTransactions(transactions)
);

const getInflowByCategory = createSelector([getInflowTransactions], transactions =>
  summarizeTransactions(transactions)
);

export const getOutflowByCategoryName = createSelector(getOutflowByCategory, getCategories, (trans, cat) =>
  applyCategoryName(trans, cat)
);

export const getInflowByCategoryName = createSelector(getInflowByCategory, getCategories, (trans, cat) =>
  applyCategoryName(trans, cat)
);

export const getPercentageOfTotalFromTransaction = memoize(transaction =>
  createSelector([getInflowBalance, getOutflowBalance], (inflowBalance, outflowBalance) => {
    const { value } = transaction;
    return Math.abs(value) / (value < 0 ? outflowBalance : inflowBalance);
  })
);

export const getFormattedTransactionPercentage = memoize((state, transaction) =>
  formatAmount(getPercentageOfTotalFromTransaction(transaction)(state), true, true)
);

export const getTransactionChartData = memoize(transactionId =>
  createSelector([getTransactionById(transactionId), getInflowBalance, getOutflowBalance], 
  (transaction, inflowBalance, outflowBalance) => {
    let value = get(transaction, 'value', null);
    const isNegative = value < 0;
    value = Math.abs(value);
    const balance = isNegative ? outflowBalance : inflowBalance;
    const finalBalance = Math.abs(balance) - value;
  
    return [
      {
        value: value,
        categoryId: get(transaction, 'id', null),
        label: get(transaction, 'description', null),
      },
      {
        value: finalBalance,
        categoryId: 'mockId12345678',
        label: `Rest of ${isNegative ? 'outflow items' : 'inflow items'}`,
      },
    ];
  })
);
