import * as React from 'react';
import Form from '../Form';
import { Icon, Input } from 'semantic-ui-react';
import { convertToCents } from '../helpers';
import { connect } from 'react-redux';
import { models } from '../store';
import { RematchDispatch } from '@rematch/core';
import moment from 'moment';

interface IProps extends ReturnType<typeof mapDispatch> {
  transactionId: string;
  cancel: VoidFunction;
  initialValues: {
    description: string;
    amount: string;
    date: string;
  };
}

class EditTransactionForm extends Form<IProps, {}> {
  state = { ...this.props.initialValues };

  public handleSubmit = () => {
    const { description, amount } = this.state;
    this.props.updateTransaction({
      id: this.props.transactionId,
      description,
      amount: convertToCents(amount),
    });
  }

  render() {
    return (
      <tr>
        <td>{moment(this.props.initialValues.date).format('LL')}</td>
        <td>
          <Input
            value={this.state.description}
            onChange={this.handleInputChange}
            onBlur={this.handleTextInputBlur}
            name="description"
          />
        </td>
        <td>
          <Input
            value={this.state.amount}
            onChange={this.handleInputChange}
            onBlur={this.handleCurrencyInputBlur}
            name="amount"
            type="number"
            step="0.01"
            min={0.01}
          />
        </td>
        <td>
          <Icon name="save" onClick={this.handleSubmit}/>
          <Icon name="cancel" onClick={this.props.cancel}/>
        </td>
      </tr>
      );
    }
  }

const mapDispatch = (dispatchEvent: RematchDispatch<models>) => ({
  updateTransaction: dispatchEvent.transactions.updateAsync,
});

export default connect(null, mapDispatch) (EditTransactionForm);
