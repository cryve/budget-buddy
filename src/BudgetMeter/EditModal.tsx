import { RematchDispatch, RematchRootState } from '@rematch/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import AbstractForm from '../Form';
import { convertToCents, normalizeCurrencyAmount } from '../helpers';
import withModal from '../Modal';
import { models } from '../store';

interface IProps extends Partial<ReturnType<typeof mapState>>, Partial<ReturnType<typeof mapDispatch>> {
  open: VoidFunction;
  close: VoidFunction;
  initialValues: IState;
  id: string;
}

interface IState {
  title: string;
  currentBalance: string;
  targetBalance: string;
}

class EditBudgetForm extends AbstractForm<IProps, IState> {
  state = {
    title: this.props.initialValues.title,
    currentBalance: normalizeCurrencyAmount(this.props.initialValues.currentBalance),
    targetBalance: normalizeCurrencyAmount(this.props.initialValues.targetBalance),
  };

  public componentDidMount() {
    this.props.initializeForm();
  }

  public handleSubmit = () => {
    const { title, targetBalance } = this.state;
    if (title && this.hasChangedValues()) {
      this.props.updateBudget({
        id: this.props.id,
        title,
        targetBalance: convertToCents(targetBalance),
      });
    }
  }

  public render() {
    const { errors } = this.props.form;
    const { title, currentBalance, targetBalance } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} error={true}>
        <Form.Input
            fluid={true}
            name="title"
            onBlur={this.handleTextInputBlur}
            onChange={this.handleInputChange}
            placeholder="Title for new Budget"
            value={title}
        />
         {errors && errors.title && (
            <Message error={true} content={errors.title} />
          )}
        <Form.Field>
          <label>Current Budget</label>
          <Input
            fluid={true}
            type="number"
            placeholder="Current balance"
            onChange={this.handleInputChange}
            value={currentBalance}
            label={{ basic: true, content: '€' }}
            labelPosition="right"
            step="0.01"
            name="currentBalance"
            onBlur={this.handleCurrencyInputBlur}
            disabled={true}
          />
        </Form.Field>
        <Form.Field>
          <label>Needed Budget (monthly or one-time goal)</label>
          <Form.Input
            fluid={true}
            type="number"
            placeholder="Monthly or one-time target"
            onChange={this.handleInputChange}
            value={targetBalance}
            label={{ basic: true, content: '€' }}
            labelPosition="right"
            step="0.01"
            name="targetBalance"
            onBlur={this.handleCurrencyInputBlur}
          />
        </Form.Field>
        <Button
          color="blue"
          fluid={true}
          size="large"
          disabled={!title || !this.hasChangedValues()}
        >
          Save
        </Button>
      </Form>
    );
  }

  private hasChangedValues() {
    let hasChangedValue = false;
    for (const key in this.props.initialValues) {
      if (this.state[key] !== this.props.initialValues[key]) {
        hasChangedValue = true;
      }
    }
    return hasChangedValue;
  }
}

const mapState = (state: RematchRootState<models>) => ({
  form: state.editBudgetForm,
});

const mapDispatch = (dispatchEvent: RematchDispatch<models>) => ({
  updateBudget: dispatchEvent.budgets.updateAsync,
  initializeForm: dispatchEvent.editBudgetForm.initialize,
});

export default withModal(
  connect(mapState, mapDispatch)(EditBudgetForm)
);
