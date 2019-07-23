import * as React from 'react';
import { InputOnChangeData } from 'semantic-ui-react';
import { normalizeCurrencyAmount } from './helpers';

interface Form<P = {}, S =  {}> {}
type TEventWithControlledtInputProps = { target: { name: string; min: number }};
export type TBlurEventHandler = (event: FocusEvent & TEventWithControlledtInputProps) => void;
export type TChangeEventHandler = (
  event: React.FormEvent<HTMLInputElement>,
  { value, name }: InputOnChangeData
) => void;

abstract class Form<P, S> extends React.Component<P, S> {
  public abstract handleSubmit: VoidFunction;

  public handleInputChange: TChangeEventHandler = (event, { value, name }) => {
    const field = name;
    const stateUpdate = {};
    stateUpdate[field] = value;
    this.setState(stateUpdate);
  }

  public handleCurrencyInputBlur: TBlurEventHandler = (event) => {
    const stateKey = event.target.name;
    const minAmount = event.target.min;
    const stateUpdate = {};
    stateUpdate[stateKey] = normalizeCurrencyAmount(this.state[stateKey], '', minAmount);

    this.setState(stateUpdate);
  }

  public handleTextInputBlur: TBlurEventHandler = (event) => {
    const stateKey = event.target.name;
    const stateUpdate = {};
    stateUpdate[stateKey] = this.state[stateKey].trim();

    this.setState(stateUpdate);
  }
}

export default Form;
