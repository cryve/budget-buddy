import { RematchDispatch, RematchRootState } from '@rematch/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { convertToEuros } from '../helpers';
import withModal from '../Modal';
import { models } from '../store';
import EditTransaction from './EditTransaction';
import moment from 'moment';

interface ITransactionListProps extends Partial<ReturnType<typeof mapState>>, Partial<ReturnType<typeof mapDispatch>> {
  title: string;
  description: string;
  targetBudget: string;
  currentBudget: string;
  budgetId: string;
}

interface ITransactionListState {
  currentlyEditedTransactionIndex?: number;
}

class TransactionList extends React.Component<ITransactionListProps & any, ITransactionListState> {
  currentlyEditedTransactionIndex: string;

  public componentDidMount() {
    this.props.subscribeByBudget(this.props.budgetId);
    this.props.resetForm();
  }

  render() {
    const { transactions } = this.props;
    return (
      <table>
        <thead>
          <td>Date</td>
          <td>Description</td>
          <td>Amount</td>
        </thead>
        <tbody>
          {transactions && transactions.map((transaction, index: number) => (
            this.state.currentlyEditedTransactionIndex === index && !this.props.editSubmitted ?
              <EditTransaction
                transactionId={transaction.id}
                initialValues={{
                  amount: convertToEuros(transaction.amount),
                  description: transaction.description,
                  date: transaction.date,
                }}
                cancel={this.hideInlineEditForm}
              />
            :
            <tr>
              <td>{moment(transaction.date).format('LL')}</td>
              <td>{transaction.description}</td>
              <td>{convertToEuros(transaction.amount)}</td>
              <td>
                <Icon name="trash" onClick={() => this.props.deleteTransaction(transaction.id)}/>
                <Icon name="edit" onClick={() => this.showInlineEditForm(index)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  private showInlineEditForm(transactionIndex: number) {
    this.setState({
      currentlyEditedTransactionIndex: transactionIndex,
    });
    this.props.resetForm();
  }

  private hideInlineEditForm = () => {
    this.setState({ currentlyEditedTransactionIndex: null });
  }
}

const mapState = (state: RematchRootState<models>, ownProps: ITransactionListProps) => ({
  transactions: state.transactions.byBudget[ownProps.budgetId],
  editSubmitted: state.editTransactionForm.submitted,
});

const mapDispatch = (dispatchEvent: RematchDispatch<models>) => ({
  subscribeByBudget: dispatchEvent.transactions.subscribeByBudgetAsync,
  deleteTransaction: dispatchEvent.transactions.deleteAsync,
  resetForm: dispatchEvent.editTransactionForm.initialize,
});

export default withModal(
  connect(mapState, mapDispatch)(TransactionList)
);
