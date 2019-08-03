import { createModel } from '@rematch/core';
import getDatabase from './database';

export interface IBudget {
  id?: string;
  title: string;
  balance: number;
  targetBalance?: number;
}

export interface IIncome {
  incomeAmount: number;
  description: string;
  budgetIds: string[];
}

export interface IExpense {
  expenseAmount: number;
  budgetId: string;
  description: string;
}

interface ITransaction {
  amount: number;
  description: string;
  date: string;
}

interface IFormError {
  field: string;
  message: string;
}

interface ModalState {
  openModal: string | null;
}

export type BudgetsState = IBudget[];

type FormsState = {
  errors?: {
    title?: string;
  };
  submitted: boolean;
};

type ActiveModalsState = {
  newIncomeForm?: boolean;
  newExpenseForm?: boolean;
};

interface TransactionsState {
  byBudget: {
    [key: string]: ITransaction[];
  };
}

interface IUpdateByBudgetPayload {
  budgetId: string;
  transactionsByBudget: ITransaction[];
}

const splitEvenly = (amount: number, portionsCount: number) => {
  const leastAmountPerPart = Math.floor(amount / portionsCount);
  const remainder = amount % portionsCount;
  const portions: number[] = Array(portionsCount).fill(leastAmountPerPart);
  const portionsWithRemainder = portions.map((portion, index) => {
    if (index < remainder) {
      return portion + 1;
    }
    return portion;
  });
  return portionsWithRemainder;
};

export const budgets = createModel({
  state: [],
  reducers: {
    create: (state: BudgetsState, payload: IBudget): BudgetsState => {
      return [...state, payload];
    },
    updateBudgets: (state: BudgetsState, payload: IBudget[]): BudgetsState => {
      return [...payload];
    },
  },
  effects: (dispatchEvent) => ({
    async createAsync(payload: IBudget) {
      try {
        const db = await getDatabase();
        return await db.collections.budgets.insert(payload);
      } catch (error) {
        if (error.message === 'title already used') {
          dispatchEvent.newBudgetForm.submitError({
            field: 'title',
            message: 'This title is already used for an existing Budget.',
          });
        } else {
          // tslint:disable-next-line: no-console
          console.error(error);
        }
      }
    },
    async updateAsync({ id, title, targetBalance }: Pick<IBudget, 'id' | 'title' | 'targetBalance'>) {
      try {
        const db = await getDatabase();
        const budgetDoc = await db.collections.budgets.findOne(id).exec();
        const budgetWithSameTitle = await db.collections.budgets.findOne().where('title').eq(title).exec();
        if (budgetWithSameTitle && budgetWithSameTitle.get('id') === budgetDoc.get('id')) {
          throw new Error('title already used');
        }
        budgetDoc.update({$set: {
          title,
          targetBalance,
        }});
        dispatchEvent.modal.close();
      } catch (error) {
        if (error.message === 'title already used') {
          dispatchEvent.editBudgetForm.submitError({
            field: 'title',
            message: 'This title is already used for another Budget.',
          });
        } else {
          // tslint:disable-next-line: no-console
          console.error(error);
        }
      }
    },
    async addToBalance({ budgetId, amount }: { budgetId: string; amount: number }) {
      try {
        const db = await getDatabase();
        const budgetDoc = await db.collections.budgets.findOne(budgetId).exec();
        budgetDoc.update({ $inc: { balance: amount }});
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    },
    async subscribeToAllBudgets() {
      try {
        const db = await getDatabase();
        const query = db.collections.budgets.find();
        query.$.subscribe(docs => {
          const allBudgets: IBudget[] = docs.map(doc => ({
            id: doc.get('_id'),
            title: doc.get('title'),
            balance: doc.get('balance'),
            targetBalance: doc.get('targetBalance'),
          }));
          dispatchEvent.budgets.updateBudgets(allBudgets);
        });
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    },
    async deleteAsync(budgetId: string) {
      try {
        const db = await getDatabase();
        const budgetDoc = await db.collections.budgets.findOne(budgetId).exec();
        if (!budgetDoc) {
          throw Error(`Could not find budget with id "${budgetId}"`);
        }
        await budgetDoc.remove();
        dispatchEvent.modal.close();
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    },
  }),
});

const formModel = {
  state: { submitted: false } as FormsState,
  reducers: {
    submitError: (state: FormsState, payload: IFormError) => {
      const errors = {};
      errors[payload.field] = payload.message;
      return { ...state, errors };
    },
    submitSuccess: (state: FormsState) => {
      const { errors, ...stateWithoutErrors } = state;
      return { ...stateWithoutErrors, submitted: true };
    },
    initialize: (state: FormsState) => {
      return { submitted: false };
    },
  },
};

export const newBudgetForm = createModel(formModel);
export const newIncomeForm = createModel(formModel);
export const newExpenseForm = createModel(formModel);
export const editBudgetForm = createModel(formModel);
export const editTransactionForm = createModel(formModel);

export const modal = createModel({
  state: { openModal: null } as ModalState,
  reducers: {
    open: (state: ModalState, { modalName }: { modalName: string }) => {
      return { ...state, openModal: modalName };
    },
    close: (state: ModalState) => {
      return { ...state, openModal: null };
    },
  },
});

export const transactions = createModel({
  state: { byBudget: {} } as TransactionsState,
  reducers: {
    updateByBudget: (state: TransactionsState, { budgetId, transactionsByBudget }: IUpdateByBudgetPayload) => {
      return { ...state, byBudget: { ...state.byBudget, [budgetId]: transactionsByBudget }};
    },
  },
  effects: (dispatchEvent) => ({
    async subscribeByBudgetAsync(budgetId: string) {
      try {
        const db = await getDatabase();
        const query = db.collections.transactions.find().where('budgetId').eq(budgetId);
        query.$.subscribe(docs => {
          const transactionsByBudget: ITransaction[] = docs.map(document => ({
            id: document.get('_id'),
            description: document.get('description'),
            amount: document.get('amount'),
            date: document.get('date'),
          }));
          dispatchEvent.transactions.updateByBudget({budgetId, transactionsByBudget});
        });
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    },
    async addTransaction({ budgetId, amount, description }: { budgetId: string; amount: number; description: string }) {
      try {
        const db = await getDatabase();
        const transaction = {
          budgetId,
          amount,
          description,
          date: Date.now(),
        };
        await db.collections.transactions.insert(transaction);
        dispatchEvent.budgets.addToBalance({ budgetId, amount });
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    },
    async updateAsync({ id, amount, description }: Partial<ITransaction> & { id: string }) {
      try {
        const db = await getDatabase();
        const transactionDoc = await db.collections.transactions.findOne(id).exec();
        const previousAmount = transactionDoc.get('amount');
        const budgetId = transactionDoc.get('budgetId');
        transactionDoc.update({$set: {
          amount,
          description,
        }});
        const amountDifference = amount - previousAmount;
        dispatchEvent.budgets.addToBalance({ budgetId, amount: amountDifference });
        dispatchEvent.editTransactionForm.submitSuccess();
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    },
    async deleteAsync(transactionId: string) {
      try {
        const db = await getDatabase();
        const transactionDoc = await db.collections.transactions.findOne(transactionId).exec();
        if (!transactionDoc) {
          throw Error(`Could not find transaction with id "${transactionId}"`);
        }
        await transactionDoc.remove();
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    },
    async distributeIncome({ incomeAmount, budgetIds, description }: IIncome ) {
      if (!incomeAmount || !budgetIds.length) {
        return;
      }
      try {
        if (incomeAmount < 1) {
          throw Error(`Income amount has to be at least 1`);
        }
        if (!budgetIds.length) {
          throw Error(`At least one budget has to be selected`);
        }
        const increasePortions = splitEvenly(incomeAmount, budgetIds.length);
        budgetIds.forEach(async (budgetId, index) => {
          const increaseAmount = increasePortions[index];
          const percentage = (increaseAmount / incomeAmount) * 100;
          dispatchEvent.transactions.addTransaction({
            budgetId: budgetId,
            amount: increaseAmount,
            description: `${description} (${percentage.toFixed(2)}%)`,
          });
        });
        dispatchEvent.newIncomeForm.submitSuccess();
        dispatchEvent.modal.close();
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    },
    async addExpense({ expenseAmount, budgetId, description }: IExpense ) {
      try {
        if (!budgetId) {
          throw Error('A budget id has to be selected');
        }
        if (expenseAmount < 1) {
          throw Error('Expense amount has to be at least 1');
        }
        dispatchEvent.transactions.addTransaction({
          amount: -expenseAmount,
          budgetId,
          description,
        });
        dispatchEvent.newExpenseForm.submitSuccess();
        dispatchEvent.modal.close();
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    },
  }),
});
