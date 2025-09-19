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


export const AGGREGATE_SUMMARY = gql`
  query AggregateSummary($year: Int!, $month: Int!) {
    aggregateSummary(year: $year, month: $month) {
      totalIncome
      totalExpense
      netSavings
    }
  }
`;


export const MONTHLY_REVIEW_SUMMARY = gql`
  query MonthlyReviewSummary($year: Int!, $month: Int!) {
    monthlyReview(year: $year, month: $month) {
      totalIncome
      totalExpenses
      savings
      categoryBreakdown { name amount }
    }
  }
`;


export const DASHBOARD_TRANSACTIONS = gql`
  query DashboardTransactions($filters: TransactionsFilter!, $cursor: String) {
    transactions(filters: $filters, cursor: $cursor) {
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
