// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { getInflowBalance, getOutflowBalance } from 'selectors/transactions';

import DonutChart from 'components/DonutChart';

type ChartProps = {
  transaction: Object,
  inflowBalance: number,
  outflowBalance: number,
};

const Chart = ({ transaction, inflowBalance, outflowBalance }: ChartProps) => {
  let value = get(transaction, 'value');
  const isNegative = value < 0;
  value = Math.abs(value);
  const balance = isNegative ? outflowBalance : inflowBalance;
  const finalBalance = Math.abs(balance) - value;

  const data = [
    {
      value: value,
      categoryId: get(transaction, 'id', null),
      label: get(transaction, 'description', null),
    },
    {
      value: finalBalance,
      categoryId: 'hto323jgfdk',
      label: `Rest of ${isNegative ? 'outflow items' : 'inflow items'}`,
    },
  ];

  return <DonutChart data={data} dataLabel="label" dataKey="categoryId" />;
};

const mapStateToProps = state => ({
  inflowBalance: getInflowBalance(state),
  outflowBalance: getOutflowBalance(state),
});

export default connect(mapStateToProps)(Chart);
