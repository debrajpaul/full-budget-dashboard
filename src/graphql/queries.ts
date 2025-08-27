import { gql } from '@apollo/client';


export const GET_TENANTS = gql`
query GetTenants { tenants { id name } }
`;


export const OVERVIEW = gql`
query Overview($tenantId: ID!, $month: Int!, $year: Int!) {
monthlyReview(tenantId: $tenantId, month: $month, year: $year) {
totalIncome
totalExpenses
savings
categoryBreakdown { name amount }
series { date budget actual }
}
}
`;


export const TRANSACTIONS = gql`
query Transactions($tenantId: ID!, $filters: TxFilters, $cursor: String) {
transactions(tenantId: $tenantId, filters: $filters, cursor: $cursor) {
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
query SavingsGoals($tenantId: ID!) {
savingsGoals(tenantId: $tenantId) {
id
name
target
current
deadline
history { date value }
}
}
`;