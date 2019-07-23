import { RematchDispatch, RematchRootState } from '@rematch/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form, Input } from 'semantic-ui-react';
import AbstractForm from '../Form';
import { convertToCents } from '../helpers';
import withModal from '../Modal';
import { models } from '../store';

interface IProps extends Partial<ReturnType<typeof mapState>>, Partial<ReturnType<typeof mapDispatch>> {
  open: VoidFunction;
  close: VoidFunction;
}

interface IState {
  selectedBudgetId: string;
  expenseAmount: string;
  description: string;
}

class NewExpenseForm extends AbstractForm<IProps, IState> {
  state = {
    expenseAmount: '',
    description: '',
    selectedBudgetId: '',
  };

  public handleSubmit = () => {
    const { expenseAmount, selectedBudgetId, description } = this.state;
    if (this.isValid()) {
      this.props.addExpense({
        budgetId: selectedBudgetId,
        expenseAmount: convertToCents(expenseAmount),
        description,
      });
    }
  }

  render() {
    const { budgetOptions } = this.props;
    const { expenseAmount, description, selectedBudgetId } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
      <Form.Field required={true}>
        <label>Amount of Expense</label>
        <Input
          fluid={true}
          type="number"
          placeholder="Expense amount"
          value={expenseAmount}
          label={{ basic: true, content: '€' }}
          labelPosition="right"
          step="0.01"
          min={0.01}
          name="expenseAmount"
          onBlur={this.handleCurrencyInputBlur}
          onChange={this.handleInputChange}
        />
      </Form.Field>
      <Form.Input
        fluid={true}
        name="description"
        onBlur={this.handleTextInputBlur}
        onChange={this.handleInputChange}
        placeholder="What did you spent your money on?"
        value={description}
        label="Description"
      />
      <Form.Field required={true}>
        <label>Budget</label>
        <Dropdown
          name="selectedBudgetId"
          placeholder="Select Budget"
          fluid={true}
          selection={true}
          options={budgetOptions.map(option => ({
            key: option.id,
            value: option.id,
            text: option.title,
          }))}
          onChange={this.handleInputChange}
          value={selectedBudgetId}
        />
      </Form.Field>
      <Form.Group>
        <Form.Button onClick={this.props.close}>Cancel</Form.Button>
        <Form.Button floated="right" type="submit" primary={true} disabled={!this.isValid()}>
          Record Expense!
        </Form.Button>
      </Form.Group>
      </Form>
    );
  }

  private isValid() {
    return !!(this.state.expenseAmount && this.state.selectedBudgetId);
  }
}

const mapState = (state: RematchRootState<models>) => ({
  budgetOptions: state.budgets.map(budget => ({
    id: budget.id,
    title: budget.title,
  })),
});

const mapDispatch = (dispatchEvent: RematchDispatch<models>) => ({
  addExpense: dispatchEvent.transactions.addExpense,
});

export default withModal(
  connect(mapState, mapDispatch) (NewExpenseForm)
);
