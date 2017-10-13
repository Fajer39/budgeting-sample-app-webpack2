// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { getFormattedTransactionPercentage } from 'selectors/transactions';

type PercentageProps = {
  amount: Object,
};

const Percentage = ({ amount }: PercentageProps) => <h2>{get(amount, 'text')}</h2>;

const mapStateToProps = (state, { transaction }) => ({
  amount: getFormattedTransactionPercentage(state, transaction),
});

export default connect(mapStateToProps)(Percentage);
