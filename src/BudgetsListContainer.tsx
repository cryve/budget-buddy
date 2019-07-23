import * as React from 'react';
import { connect } from 'react-redux';
import { RematchRootState, RematchDispatch } from '@rematch/core';
import { models } from './store';
import BudgetsList from './BudgetsList';

interface IBudgetsListProps
  extends Partial<ReturnType<typeof mapState>>, Partial<ReturnType<typeof mapDispatch>> {}

const mapState = (state: RematchRootState<models>) => ({
    budgets: state.budgets,
});

const mapDispatch = (dispatchEvent: RematchDispatch<models>) => ({
    subscribeToAllBudgets: dispatchEvent.budgets.subscribeToAllBudgets,
});

class BudgetsListContainer extends React.Component<IBudgetsListProps, {}> {
    public componentDidMount() {
        this.props.subscribeToAllBudgets();
    }

    public render() {
        return (
            <BudgetsList
                budgets={this.props.budgets}
            />
        );
    }
}

export default connect(mapState, mapDispatch)(BudgetsListContainer);
