import * as React from 'react';
import styled from 'styled-components';
import { Grid, Container } from 'semantic-ui-react';
import { IBudget} from './models';
import BudgetMeter from './BudgetMeter';
import NewBudgetContainer from './NewBudgetContainer';

interface BudgetsListProps {
    budgets?: IBudget[];
}

const BudgetsList = ({
    budgets,
}: BudgetsListProps) => {
    return (
        <Container>
            <Grid>
                <Grid.Row centered={true} columns={4}>
                    {budgets.map((budget, index) => (
                        <BudgetMeter
                            id={budget.id}
                            title={budget.title}
                            balance={budget.balance}
                            targetBalance={budget.targetBalance}
                        />
                    ))}
                    <NewBudgetContainer />
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default BudgetsList;
