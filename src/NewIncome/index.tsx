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
  selectedBudgetIds: string[];
  incomeAmount: string;
  description: string;
}

class NewIncomeForm extends AbstractForm<IProps, IState> {
  state = {
    incomeAmount: '',
    description: '',
    selectedBudgetIds: [],
  };

  public handleSubmit = () => {
    const { incomeAmount, selectedBudgetIds, description } = this.state;
    if (this.isValid()) {
      this.props.distributeIncome({
        incomeAmount: convertToCents(incomeAmount),
        budgetIds: selectedBudgetIds,
        description,
      });
    }
  }

  render() {
    const { budgetOptions } = this.props;
    const { incomeAmount, description, selectedBudgetIds } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field required={true}>
          <label>Amount of Income</label>
          <Input
            fluid={true}
            type="number"
            placeholder="Income amount"
            value={incomeAmount}
            label={{ basic: true, content: '€' }}
            labelPosition="right"
            step="0.01"
            min={0.01}
            name="incomeAmount"
            onBlur={this.handleCurrencyInputBlur}
            onChange={this.handleInputChange}
          />
        </Form.Field>
        <Form.Input
          fluid={true}
          name="description"
          onBlur={this.handleTextInputBlur}
          onChange={this.handleInputChange}
          placeholder="What kind of income?"
          value={description}
          label="Description"
        />
        <Form.Field required={true}>
          <label>Budgets to replenish</label>
          <Dropdown
            name="selectedBudgetIds"
            placeholder="Select Budget(s)"
            fluid={true}
            multiple={true}
            selection={true}
            options={budgetOptions.map(option => ({
              key: option.id,
              value: option.id,
              text: option.title,
            }))}
            onChange={this.handleInputChange}
            value={selectedBudgetIds}
          />
        </Form.Field>
        <Form.Group>
          <Form.Button onClick={this.props.close}>Cancel</Form.Button>
          <Form.Button floated="right" type="submit" primary={true} disabled={!this.isValid()}>
            Distribute Income!
          </Form.Button>
        </Form.Group>
      </Form>
    );
  }

  private isValid() {
    return !!(this.state.incomeAmount && this.state.selectedBudgetIds.length);
  }
}

const mapState = (state: RematchRootState<models>) => ({
  budgetOptions: state.budgets.map(budget => ({
    id: budget.id,
    title: budget.title,
  })),
});

const mapDispatch = (dispatchEvent: RematchDispatch<models>) => ({
  distributeIncome: dispatchEvent.transactions.distributeIncome,
});

export default withModal(
  connect(mapState, mapDispatch) (NewIncomeForm)
);
