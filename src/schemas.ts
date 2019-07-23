export const budgetSchema = {
  title: 'budget schema',
  version: 0,
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    balance: {
      type: 'number',
    },
    targetBalance: {
      type: 'number',
    },
  },
  required: ['balance', 'title'],
};

export const transactionSchema = {
  title: 'transaction schema',
  version: 0,
  type: 'object',
  properties: {
    description: {
      type: 'string',
    },
    amount: {
      type: 'number',
    },
    budgetId: {
      type: 'string',
    },
    date: {
      type: 'number',
    },
  },
  required: ['description', 'amount', 'budgetId', 'date'],
};
