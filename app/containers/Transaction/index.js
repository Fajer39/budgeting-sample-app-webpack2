// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import transactionReducer from 'modules/transactions';
import categoryReducer from 'modules/categories';
import { injectAsyncReducers } from 'store';

import { getTransactionById } from 'selectors/transactions';
import { getCategories } from 'selectors/categories';

import NavLink from 'components/NavLink';
import Chart from './Chart';
import Percentage from './Percentage';

import styles from './styles.scss';

// inject reducers that might not have been originally there
injectAsyncReducers({
  transactions: transactionReducer,
  categories: categoryReducer,
});

type TransactionProps = {
  transaction: Object,
  categories: Object,
};

class Transaction extends React.Component<TransactionProps> {
  render() {
    const { transaction, categories } = this.props;
    const category = categories[transaction.categoryId];

    return (
      <div className={styles.Transaction}>
        <h1>{`${category} - ${transaction.description}`}</h1>
        <Percentage transaction={transaction} />
        <Chart transaction={transaction} />
        <div>
          <NavLink to="/budget" label="Go back" styles={styles} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => ({
  transaction: getTransactionById(params.id)(state),
  categories: getCategories(state),
});

export default connect(mapStateToProps)(Transaction);
