import { RematchDispatch } from '@rematch/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dropdown, Grid, Segment, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import { normalizeCurrencyAmount } from '../helpers';
import { models } from '../store';
import * as constants from './constants';
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';
import TransactionsModal from './TransactionsModal';

interface IBudgetCircleProps extends Partial<ReturnType<typeof mapDispatch>> {
    id: string;
    balance: number;
    targetBalance: number;
    title: string;
}

type BudgetIndication = typeof constants.INDICATION_DANGER | typeof constants.INDICATION_DRAINING
    | typeof constants.INDICATION_WARNING | typeof constants.INDICATION_SAFE;

const BudgetMeterColumn = styled(Grid.Column)`
    text-align: center;
    margin-bottom: 2em;
`;

const CircularChart = styled.svg`
    display: block;
    max-height: 250px;
`;

const CircleBackground = styled.circle`
    cx: 18;
    cy: 18;
    fill: none;
    r: 15.9155;
    stroke-width: 2.8;
    stroke: #e6e6e6;
`;

interface ICircleBalance {
    indication: BudgetIndication;
    transform: string;
    strokeDasharray: string;
}

const CircleBalance =
    styled<ICircleBalance>(({ indication, ...rest }) => <CircleBackground {...rest} />)`
    stroke: ${props => mapBudgetIndicationToColor(props.indication)};
`;

const BalanceText = styled.text`
    fill: #666;
    font-family: sans-serif;
    font-size: 0.45em;
    text-anchor: middle;
`;

const TargetBalanceText = styled(BalanceText)`
    font-size: 0.20em;
`;

const mapBudgetIndication = (balancePercentage: number) => {
    if (balancePercentage <= constants.THRESHOLD_DANGER) {
        return constants.INDICATION_DANGER;
    } else if (balancePercentage <= constants.THRESHOLD_DRAINING) {
        return constants.INDICATION_DRAINING;
    } else if (balancePercentage <= constants.THRESHOLD_WARNING) {
        return constants.INDICATION_WARNING;
    }
    return constants.INDICATION_SAFE;
};
const mapBudgetIndicationToColor = (budgetState: ReturnType<typeof mapBudgetIndication>) => {
    switch (budgetState) {
        case constants.INDICATION_DANGER:
            return '#FF0303';
        case constants.INDICATION_DRAINING:
            return '#FF850A';
        case constants.INDICATION_WARNING:
            return '#FFBF00';
        case constants.INDICATION_SAFE:
        default:
            return '#008E09';
    }
};

const BudgetCircle = ({
    id,
    balance,
    targetBalance,
    title,
    openModal,
}: IBudgetCircleProps) => {
    const balancePercentage = (balance / targetBalance) * 100;
    const balanceInEuro = normalizeCurrencyAmount(balance / 100);
    const budgetIndication = mapBudgetIndication(balancePercentage);
    const targetBalanceInEuro = normalizeCurrencyAmount(targetBalance / 100);
    const modalNameDelete = `deleteBudget-${title}`;
    const modalNameEdit = `editBudget-${title}`;
    const modalNameTransactions = `transactions-${title}`;

    const handleEditClick = () => openModal({ modalName: modalNameEdit });
    const handleDeleteClick = () => openModal({ modalName: modalNameDelete });
    const handleTransactionsClick = () => openModal({ modalName: modalNameTransactions });
    return (
        <BudgetMeterColumn>
            <EditModal
                modalName={modalNameEdit}
                title={`Edit Budget "${title}"`}
                hideTrigger={true}
                id={id}
                initialValues={{
                    currentBalance: balanceInEuro,
                    targetBalance: targetBalanceInEuro,
                    title,
                }}
            />
            <DeleteModal
                modalName={modalNameDelete}
                title={`Delete Budget "${title}`}
                hideTrigger={true}
                id={id}
            />
            <TransactionsModal
                modalName={modalNameTransactions}
                title={`${title} - Transactions`}
                hideTrigger={true}
                budgetId={id}
            />
            <Segment>
                <Grid.Row align="right">
                    <Dropdown icon="settings">
                        <Dropdown.Menu>
                            <Dropdown.Item text="Edit" onClick={handleEditClick} />
                            <Dropdown.Item text="Transactions" onClick={handleTransactionsClick} />
                            <Dropdown.Item text="Delete" onClick={handleDeleteClick} />
                        </Dropdown.Menu>
                    </Dropdown>
                </Grid.Row>
                <Grid.Row>
                    <CircularChart viewBox="0 0 36 36">
                        <CircleBackground />
                        <CircleBalance
                            transform="rotate(-90 18 18)"
                            strokeDasharray={`${balancePercentage} 100`}
                            indication={budgetIndication}
                        />
                        <BalanceText x="18" y="20">{balanceInEuro} €</BalanceText>
                        <TargetBalanceText x="18" y="25">of {targetBalanceInEuro} €</TargetBalanceText>
                    </CircularChart>
                    <Header as="h1" textAlign="center">{title}</Header>
                </Grid.Row>
            </Segment>
        </BudgetMeterColumn>
    );
};

const mapDispatch = (dispatchEvent: RematchDispatch<models>) => ({
    openModal: dispatchEvent.modal.open,
    closeModal: dispatchEvent.modal.close,
});

export default connect(null, mapDispatch)(BudgetCircle);
