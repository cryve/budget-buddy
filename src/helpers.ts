export const normalizeCurrencyAmount =
  (value: string | number, defaultValue: string = '0.00', minAmount?: number): string => {
  const amount = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(amount) || (minAmount && amount < minAmount)) {
    return defaultValue;
  }

  return amount.toFixed(2);
};

export const convertToCents = (value: string) => {
  const amount = parseFloat(value);
  const amountInCents = amount * 100;
  return amountInCents;
};

export const convertToEuros = (value: number) => {
  const amount = value / 100;
  return normalizeCurrencyAmount(amount);
};
