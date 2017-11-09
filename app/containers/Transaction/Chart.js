// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { getTransactionChartData } from 'selectors/transactions';

import DonutChart from 'components/DonutChart';

type ChartProps = {
  transaction: Object,
  data: Array<Object>
};

const Chart = ({ data }: ChartProps) => {
  return <DonutChart data={data} dataLabel="label" dataKey="categoryId" />;
};

const mapStateToProps = (state, { transaction }) => ({
  data: getTransactionChartData(
    get(transaction, 'id', null)
  )(state)
});

export default connect(mapStateToProps)(Chart);
