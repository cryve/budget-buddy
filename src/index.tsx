import { RematchRootState } from '@rematch/core';
import 'babel-polyfill';
import 'preact/devtools';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import BudgetsList from './BudgetsListContainer';
import NewExpenseModal from './NewExpense';
import NewIncomeModal from './NewIncome';
import { models, store } from './store';

const mountNode = document.getElementById('app');

const AppGrid = styled(Grid)`
  ${props => props.isModalBackground && 'overflow: hidden;'}
  max-height: ${props => props.isModalBackground ? '100vh' : '100%'};
`;

const App = ({ isOpen }: any) => {
  return (
    <React.Fragment>
      <AppGrid isModalBackground={isOpen}>
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
      </AppGrid>
    </React.Fragment>
  );
};

const mapState = (state: RematchRootState<models>) => ({
  isOpen: !!state.modal.openModal,
});

const StatefulApp = connect(mapState)(App);

ReactDOM.render(
  <Provider store={store}>
    <StatefulApp />
  </Provider>,
  mountNode
);
