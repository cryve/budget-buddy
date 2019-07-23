import * as React from 'react';
import { connect } from 'react-redux';
import { RematchRootState, RematchDispatch } from '@rematch/core';
import { models } from './store';
import { Segment, Button, Header, SegmentGroup, Icon, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import Portal from 'preact-portal';

const ModalBackground = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.85);
  position: absolute;
  z-index: 100;
  left: 0;
  top: 0;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const ModalSegmentGroup = styled(SegmentGroup)`
  z-index: 101;
  left: 0;
  top: 0;
`;

const CloseIcon = styled(Icon)`
	cursor: pointer;
	position: absolute;
	top: -2.5rem;
	right: -2.5rem;
	z-index: 1;
	opacity: .8;
	font-size: 1.25em;
	color: #fff;
	width: 2.25rem;
	height: 2.25rem;
	padding: .625rem 0 0 0;
`;

const ModalHeader = styled(Header)`
  margin: 0;
`;

const withModal = (WrappedComponent: any) => {
  interface ModalProps extends
    Partial<ReturnType<typeof mapState>>,
    Partial<ReturnType<typeof mapDispatch>> {
      title: string;
      triggerLabel?: string | React.ReactNode;
      modalName: string;
      onlyLink?: boolean;
      hideTrigger?: boolean;
    }

  type IProps = ModalProps & any;

  class Modal extends React.Component<IProps> {
    constructor(props: IProps) {
      super(props);
    }

    public open = () => {
      this.props.open({modalName: this.props.modalName});
    }

    public close = () => {
      this.props.close();
    }

    public render() {
      const { triggerLabel, title, open, close, isOpen, onlyLink, hideTrigger, ...passThroughProps } = this.props;
      return (
        <React.Fragment>
          {!hideTrigger && <Grid.Column textAlign="center" verticalAlign="middle">
            { onlyLink ? <a href="#" onClick={this.open}>{triggerLabel}</a>
              : <Button onClick={this.open} content={triggerLabel} />}
          </Grid.Column>}
          {isOpen ? (
            <Portal into="#app">
            <ModalBackground>
              <ModalSegmentGroup centered={true}>
                <Segment>
                  <ModalHeader>{title}</ModalHeader>
                  <CloseIcon name="close" onClick={this.close} />
                </Segment>
                <Segment>
                  <WrappedComponent
                    close={this.close}
                    open={this.open}
                    {...passThroughProps}
                  />
                </Segment>
              </ModalSegmentGroup>
              </ModalBackground>
              </Portal>
            ) : null}
          </React.Fragment>
      );
    }
  }

  const mapState = (state: RematchRootState<models>, ownProps: IProps) => ({
    isOpen: state.modal.openModal === ownProps.modalName,
  });

  const mapDispatch = (dispatchEvent: RematchDispatch<models>) => ({
    open: dispatchEvent.modal.open,
    close: dispatchEvent.modal.close,
  });

  return connect(mapState, mapDispatch)(Modal);
};

export default withModal;
