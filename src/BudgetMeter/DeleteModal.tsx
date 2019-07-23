import { RematchDispatch } from '@rematch/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Grid } from 'semantic-ui-react';
import withModal from '../Modal';
import { models } from '../store';

interface IDeleteDialogProps extends Partial<ReturnType<typeof mapDispatch>> {
  id: string;
  close: VoidFunction;
}

const DeleteDialog = ({
  id,
  deleteBudget,
  close,
}: IDeleteDialogProps) => {
  const handleConfirm = () => deleteBudget(id);
  return (
    <Grid>
      <Grid.Row><Grid.Column><p>Do you really want to delete this budget?</p></Grid.Column></Grid.Row>
      <Grid.Row columns={2} stretched={true}>
        <Grid.Column><Button negative={true} onClick={handleConfirm}>Delete</Button></Grid.Column>
        <Grid.Column><Button onClick={close}>Cancel</Button></Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

const mapDispatch = (dispatchEvent: RematchDispatch<models>) => ({
  deleteBudget: dispatchEvent.budgets.deleteAsync,
});

export default withModal(
  connect(null, mapDispatch)(DeleteDialog)
);
