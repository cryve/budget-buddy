import * as React from 'react';
import styled from 'styled-components';
import { Grid, Form, Input, Button, Segment, InputOnChangeData, Message } from 'semantic-ui-react';
import { TEventWithControlledInputName } from './NewBudgetContainer';
import { TChangeEventHandler, TBlurEventHandler } from './Form';

interface NewBudgetProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: TChangeEventHandler;
  title?: string;
  initialBalance: string;
  handleCurrencyInputBlur: TBlurEventHandler;
  handleTextInputBlur: TBlurEventHandler;
  targetBalance: string;
  errors?: {
    title?: string;
  };
}

const FormColumn = styled(Grid.Column)`
  padding-top: 2em;
`;

const NewBudget: React.SFC<NewBudgetProps> = ({
  errors,
  handleCurrencyInputBlur,
  handleInputChange,
  handleSubmit,
  handleTextInputBlur,
  initialBalance,
  targetBalance,
  title,
}) => {
  return (
    <FormColumn>
      <Form size="large" onSubmit={handleSubmit} error={true}>
        <Segment>
          <Form.Input
            fluid={true}
            name="title"
            onBlur={handleTextInputBlur}
            onChange={handleInputChange}
            placeholder="Title for new Budget"
            value={title}
          />
          {errors && errors.title && (
            <Message error={true} content={errors.title} />
          )}
          <Form.Field>
            <label>Initial Budget</label>
            <Input
              fluid={true}
              type="number"
              placeholder="Initial balance"
              onChange={handleInputChange}
              value={initialBalance}
              label={{ basic: true, content: '€' }}
              labelPosition="right"
              step="0.01"
              name="initialBalance"
              onBlur={handleCurrencyInputBlur}
            />
          </Form.Field>
          <Form.Field>
            <label>Needed Budget (monthly or one-time goal)</label>
            <Input
              fluid={true}
              type="number"
              placeholder="Monthly or one-time target"
              onChange={handleInputChange}
              value={targetBalance}
              label={{ basic: true, content: '€' }}
              labelPosition="right"
              step="0.01"
              name="targetBalance"
              onBlur={handleCurrencyInputBlur}
            />
          </Form.Field>
          <Button
            color="blue"
            fluid={true}
            size="large"
            disabled={!title}
          >
            Create New Budget
          </Button>
        </Segment>
      </Form>
    </FormColumn>
  );
};

export default NewBudget;
