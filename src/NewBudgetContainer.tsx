import * as React from 'react';
import { InputOnChangeData } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { RematchDispatch, RematchRootState } from '@rematch/core';
import { models } from './store';
import NewBudget from './NewBudget';
import { convertToCents } from './helpers';
import AbstractForm from './Form';

const mapState = (state: RematchRootState<models>) => ({
  budgets: state.budgets,
  form: state.newBudgetForm,
});

const mapDispatch = (dispatchEvent: RematchDispatch<models>) => ({
  createBudget: dispatchEvent.budgets.createAsync,
  initializeForm: dispatchEvent.newBudgetForm.initialize,
});

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

  public componentWillReceiveProps(props: INewBudgetProps) {
    if (props.form.submitted) {
      this.setState(initialState);
    }
  }

  public handleInputChange = (
    event: React.FormEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    event.preventDefault();

    if (this.props.form.submitted) {
      this.props.initializeForm();
    }

    const stateKey: keyof IState = data.name;
    const stateUpdate = {};
    stateUpdate[stateKey] = data.value;
    this.setState(stateUpdate);
  }

  public handleSubmit = () => {
    if (this.state.title) {
      this.props.createBudget({
        balance: convertToCents (this.state.initialBalance),
        targetBalance: convertToCents(this.state.targetBalance),
        title: this.state.title,
      });
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

export default connect(mapState, mapDispatch)(NewBudgetContainer);
