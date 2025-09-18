export const transactionTypeDefs = /* GraphQL */ `
  type Transaction {
    tenantId: TenantType!
    userId: String!
    transactionId: String!
    bankName: BankName!
    amount: Float!
    balance: Float
    txnDate: String!
    description: String
    category: String
    embedding: [Float!]
    taggedBy: String
    confidence: Float
    type: String
  }
  type TransactionItem {
    id: String!
    date: String!
    description: String
    amount: Float!
    currency: String!
    category: String
    taggedBy: String
  }

  type TransactionsPage {
    items: [TransactionItem!]!
    cursor: String
  }

  type ReclassifiedTransaction {
    id: String!
    category: String!
    taggedBy: String
  }

  input TransactionsFilter {
    year: Int!
    month: Int!
    bankName: BankName
    category: String
  }

  type CategoryAmount {
    name: String!
    amount: Float!
  }

  type ReviewSeriesPoint {
    date: String!
    budget: Float!
    actual: Float!
  }
  type MonthlyReview {
    totalIncome: Float!
    totalExpenses: Float!
    savings: Float!
    categoryBreakdown: [CategoryAmount!]!
    series: [ReviewSeriesPoint!]!
  }

  type AnnualReview {
    totalIncome: Float!
    totalExpense: Float!
    netSavings: Float!
    transactions: [Transaction!]!
  }

  type CategoryGroup {
    category: String!
    totalAmount: Float!
    transactions: [Transaction!]!
  }

  type AggregatedSummary {
    totalIncome: Float!
    totalExpense: Float!
    netSavings: Float!
  }

  type Query {
    annualReview(year: Int!): AnnualReview!
    monthlyReview(month: Int!, year: Int!): MonthlyReview!
    aggregateSummary(year: Int!, month: Int): AggregatedSummary!
    categoryBreakdown(month: Int!, year: Int!): [CategoryGroup!]!
    transactions(
      filters: TransactionsFilter!
      cursor: String
    ): TransactionsPage!
  }

  type Mutation {
    addTransactionCategory: Boolean!
    reclassifyTransaction(
      id: String!
      category: String!
    ): ReclassifiedTransaction!
  }
`;

export const uploadStatementTypeDefs = /* GraphQL */ `
  input StatementInput {
    bankName: BankName!
    fileName: String!
    contentBase64: String!
  }

  type Mutation {
    uploadStatement(input: StatementInput!): Boolean!
  }
`;

export const tenantTypeDefs = /* GraphQL */ `
  type Tenant {
    id: TenantType!
    name: String!
  }

  type Query {
    tenants: [Tenant!]!
  }
`;

export const sinkingFundTypeDefs = /* GraphQL */ `
  type SinkingFundHistoryPoint {
    date: String!
    value: Float!
  }

  type SinkingFund {
    id: ID!
    name: String!
    target: Float!
    current: Float!
    monthlyContribution: Float
    deadline: String
    history: [SinkingFundHistoryPoint!]!
  }

  type Query {
    sinkingFunds: [SinkingFund!]!
  }
`;

export const savingsGoalTypeDefs = /* GraphQL */ `
  type SavingsHistoryPoint {
    date: String!
    value: Float!
  }

  type SavingsGoal {
    id: ID!
    name: String!
    target: Float!
    current: Float!
    deadline: String!
    history: [SavingsHistoryPoint!]!
  }

  type Query {
    savingsGoals: [SavingsGoal!]!
  }
`;

export const recurringTransactionTypeDefs = /* GraphQL */ `
  enum RecurringFrequency {
    monthly
    weekly
    biweekly
    yearly
  }

  type RecurringTransaction {
    id: String!
    description: String!
    amount: Float!
    category: String
    frequency: RecurringFrequency!
    dayOfMonth: Int
    dayOfWeek: Int
    monthOfYear: Int
    startDate: String!
    endDate: String
    nextRunDate: String
  }

  input CreateRecurringTransactionInput {
    description: String!
    amount: Float!
    category: String
    frequency: RecurringFrequency!
    dayOfMonth: Int
    dayOfWeek: Int
    monthOfYear: Int
    startDate: String!
    endDate: String
  }

  extend type Query {
    recurringTransactions: [RecurringTransaction!]!
  }

  extend type Mutation {
    createRecurringTransaction(
      input: CreateRecurringTransactionInput!
    ): RecurringTransaction!
    generateRecurringTransactions(month: Int!, year: Int!): Int!
  }
`;

export const forecastTypeDefs = /* GraphQL */ `
  type ForecastDay {
    date: String!
    inflow: Float!
    outflow: Float!
    net: Float!
    runningBalance: Float
  }

  enum AlertSeverity {
    info
    warning
    critical
  }

  type ForecastAlert {
    date: String!
    type: String!
    message: String!
    severity: AlertSeverity!
  }

  type ForecastResult {
    month: Int!
    year: Int!
    startingBalance: Float!
    endingBalance: Float!
    days: [ForecastDay!]!
    alerts: [ForecastAlert!]!
  }

  input ForecastOptionsInput {
    startingBalance: Float
    lowBalanceThreshold: Float
    largeExpenseThreshold: Float
  }

  type Query {
    forecastMonth(
      year: Int!
      month: Int!
      options: ForecastOptionsInput
    ): ForecastResult!
  }
`;

export const authTypeDefs = /* GraphQL */ `
  type Query {
    apiVersion: String
    healthCheck: String
  }

  input LoginInput {
    email: String!
    tenantId: TenantType!
    password: String!
  }

  type User {
    email: String!
    name: String!
    tenantId: TenantType!
    isActive: Boolean!
  }

  type LoginResponse {
    user: User!
    token: String!
  }

  type Mutation {
    login(input: LoginInput!): LoginResponse!
  }
`;
