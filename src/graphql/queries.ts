import { gql } from '@apollo/client';


export const GET_TENANTS = gql`
query GetTenants { tenants { id name } }
`;

export const HEALTH_CHECK = gql`
  query HealthCheck { healthCheck }
`;


export const OVERVIEW = gql`
  query Overview($month: Int!, $year: Int!) {
    monthlyReview(month: $month, year: $year) {
      totalIncome
      totalExpenses
      savings
      categoryBreakdown { name amount }
      series { date budget actual }
    }
  }
`;


export const TRANSACTIONS = gql`
  query Transactions($year: Int!, $month: Int!) {
    transactions(
      filters: { year: $year, month: $month }
    ) {
      items {
        id
        date
        description
        amount
        currency
        category
        taggedBy
      }
      cursor
    }
  }
`;


export const SAVINGS_GOALS = gql`
  query SavingsGoals {
    savingsGoals {
      id
      name
      target
      current
      deadline
      history { date value }
    }
  }
`;
