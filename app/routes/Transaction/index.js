// @flow
import React, { Component } from 'react';
import Chunk from 'components/Chunk';

const loadTransactionContainer = () => import('containers/Transaction' /* webpackChunkName: "transaction" */);

type TransactionProps = {
  match: Object,
};

class Transaction extends Component<TransactionProps> {
  render() {
    const { match: { params } } = this.props;
    return <Chunk load={loadTransactionContainer} params={params} />;
  }
}

export default Transaction;
