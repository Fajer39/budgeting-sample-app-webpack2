// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { getTransactions } from 'selectors/transactions';
import { getCategories } from 'selectors/categories';
import EntryFormRow from 'containers/EntryFormRow';
import type { Transaction } from 'modules/transactions';
import BudgetGridRow from 'components/BudgetGridRow';
import styles from './style.scss';

type BudgetGridProps = {
  transactions: Transaction[],
  categories: Object,
};

type BudgetGridState = {
  rowId: ?number,
};

export class BudgetGrid extends React.Component<BudgetGridProps, BudgetGridState> {
  static defaultProps = {
    transactions: [],
    categories: {},
  };

  constructor() {
    super();
    this.state = {
      rowId: null,
    };
  }

  onRowClick(id: number) {
    this.setState({ rowId: id });
  }

  render() {
    const { transactions, categories } = this.props;
    const { rowId } = this.state;

    if (rowId !== null && rowId !== undefined) return <Redirect push to={`/transaction/${rowId}`} />;

    return (
      <table className={styles.budgetGrid}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: Transaction): React.Element<any> => (
            <BudgetGridRow
              key={transaction.id}
              transaction={transaction}
              categories={categories}
              onClick={() => this.onRowClick(transaction.id)}
            />
          ))}
        </tbody>
        <tfoot>
          <EntryFormRow />
        </tfoot>
      </table>
    );
  }
}

const mapStateToProps = state => ({
  transactions: getTransactions(state),
  categories: getCategories(state),
});

export default connect(mapStateToProps)(BudgetGrid);
