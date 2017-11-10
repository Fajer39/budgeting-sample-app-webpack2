// @flow

export type FormattedAmount = {
  text: string,
  isNegative: boolean,
};

export default function formatAmount(
  amount: number,
  showSign: boolean = true,
  percentage: boolean = false
): FormattedAmount {
  const isNegative = amount < 0;
  const formatValue = Math.abs(amount).toLocaleString('en-us', {
    style: percentage ? 'percent' : 'currency',
    currency: 'USD',
  });

  return {
    /* eslint-disable no-nested-ternary */
    text: `${isNegative && showSign ? '-' : percentage ? '+' : ''}${formatValue}`,
    isNegative,
  };
}
