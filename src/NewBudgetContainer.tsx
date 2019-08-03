import { RematchDispatch, RematchRootState } from '@rematch/core';
import * as React from 'react';
import { connect } from 'react-redux';
import AbstractForm from './Form';
import { convertToCents } from './helpers';
import NewBudget from './NewBudget';
import { models } from './store';

interface INewBudgetProps
  extends Partial<ReturnType<typeof mapState>>, Partial<ReturnType<typeof mapDispatch>> {}

interface IState {
  title: string;
  initialBalance: string;
  targetBalance: string;
}

type IStateKey = keyof IState;
export type TEventWithControlledInputName = { target: { name: IStateKey }};

const initialState = {
  title: '',
  initialBalance: '0.00',
  targetBalance: '50.00',
};

class NewBudgetContainer extends AbstractForm<INewBudgetProps, IState> {
  constructor(props: INewBudgetProps) {
    super(props);
    this.state = { ...initialState };
  }

  public handleSubmit = async () => {
    if (this.state.title) {
      const result = await this.props.createBudget({
        balance: convertToCents (this.state.initialBalance),
        targetBalance: convertToCents(this.state.targetBalance),
        title: this.state.title,
      });
      if (result) {
        this.props.submitSuccess();
        this.setState(initialState);
        this.props.initializeForm();
      }
    }
  }

  public render() {
    return (
      <NewBudget
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        title={this.state.title}
        initialBalance={this.state.initialBalance}
        handleCurrencyInputBlur={this.handleCurrencyInputBlur}
        handleTextInputBlur={this.handleTextInputBlur}
        targetBalance={this.state.targetBalance}
        errors={this.props.form.errors}
      />
    );
  }
}

const mapState = (state: RematchRootState<models>) => ({
  budgets: state.budgets,
  form: state.newBudgetForm,
});

const mapDispatch = (dispatchEvent: RematchDispatch<models>) => ({
  createBudget: dispatchEvent.budgets.createAsync,
  submitSuccess: dispatchEvent.newBudgetForm.submitSuccess,
  initializeForm: dispatchEvent.newBudgetForm.initialize,
});

export default connect(mapState, mapDispatch)(NewBudgetContainer);
