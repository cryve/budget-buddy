import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'preact/devtools';
import 'babel-polyfill';
import 'semantic-ui-css/semantic.min.css';
import { Provider } from 'react-redux';
import { store } from './store';
import BudgetsList from './BudgetsListContainer';
import NewIncomeModal from './NewIncome';
import NewExpenseModal from './NewExpense';
import { Grid, Container } from 'semantic-ui-react';

const mountNode = document.getElementById('app');
ReactDOM.render(
  <Provider store={store}>
    <React.Fragment>
      <Grid>
        <Grid.Row centered={true}>
            <NewIncomeModal
              title="Distribute new income"
              triggerLabel="Add new income"
              modalName="newIncomeForm"
            />
            <NewExpenseModal
              title="Record new expense"
              triggerLabel="Add new expense"
              modalName="newExpenseForm"
            />
        </Grid.Row>
        <Grid.Row centered={true}>
          <BudgetsList />
        </Grid.Row>
      </Grid>
    </React.Fragment>
  </Provider>,
  mountNode
);
