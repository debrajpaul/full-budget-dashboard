// Configuration: adjust the endpoint to match your back-end.  If your back-end
// GraphQL server is running locally on port 4005 (the default for the
// full-budget-app), the endpoint will be something like http://localhost:4005/graphql.
const GRAPHQL_ENDPOINT = 'http://localhost:4005/graphql';

// Provide a JWT token here if your GraphQL API requires authentication.
// You can store the token in localStorage after login, or hard-code it for
// testing. Leave empty if your API is public (not recommended in production).
let AUTH_TOKEN = localStorage.getItem('jwtToken') || '';

// Format numbers as currency
function formatCurrency(value) {
  return '$' + (value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Generic GraphQL fetch helper
async function graphqlRequest(query, variables = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (AUTH_TOKEN) {
    headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json();
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(result.errors.map((e) => e.message).join(', '));
  }
  return result.data;
}

// Fetch monthly overview from the back-end
async function fetchOverview(month, year) {
  const query = `
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
  const data = await graphqlRequest(query, { month, year });
  return data.monthlyReview;
}

// Fetch transactions for a given month and year
async function fetchTransactions(month, year) {
  const query = `
    query Transactions($year: Int!, $month: Int!) {
      transactions(filters: { year: $year, month: $month }) {
        items {
          id
          date
          description
          amount
          currency
          category
          taggedBy
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { year, month });
  return data.transactions?.items ?? [];
}

// Render KPI values to the DOM
function renderKPIs(review) {
  document.getElementById('kpi-income').textContent = formatCurrency(review.totalIncome);
  document.getElementById('kpi-expenses').textContent = formatCurrency(review.totalExpenses);
  document.getElementById('kpi-savings').textContent = formatCurrency(review.savings);
  // Calculate budget from series (sum of budget values)
  const budgetTotal = (review.series || []).reduce((total, entry) => total + (entry?.budget ?? 0), 0);
  document.getElementById('kpi-budget').textContent = formatCurrency(budgetTotal);
}

// Render the line chart for budget vs actual using Chart.js
function renderLineChart(review) {
  const ctx = document.getElementById('lineChart').getContext('2d');
  // Prepare labels and data
  const labels = review.series?.map((entry) => entry.date) ?? [];
  const budgetData = review.series?.map((entry) => entry.budget ?? 0) ?? [];
  const actualData = review.series?.map((entry) => entry.actual ?? 0) ?? [];
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Budget',
          data: budgetData,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Actual',
          data: actualData,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });
}

// Render the donut chart for spending breakdown using Chart.js
function renderDonutChart(review) {
  const ctx = document.getElementById('donutChart').getContext('2d');
  const labels = review.categoryBreakdown?.map((item) => item.name) ?? [];
  const values = review.categoryBreakdown?.map((item) => item.amount) ?? [];
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#36b37e', // income color from tailwind config
            '#ff5630', // expense color
            '#6554c0', // savings color
            '#3B82F6',
            '#F59E0B',
            '#22C55E',
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
      },
    },
  });
}

// Render transactions table
function renderTransactions(transactions) {
  const tbody = document.getElementById('transactionsBody');
  tbody.innerHTML = '';
  transactions.forEach((txn) => {
    const row = document.createElement('tr');
    const dateCell = document.createElement('td');
    const descCell = document.createElement('td');
    const catCell = document.createElement('td');
    const amountCell = document.createElement('td');
    dateCell.textContent = new Date(txn.date).toLocaleDateString('en-US');
    descCell.textContent = txn.description;
    catCell.textContent = txn.category;
    amountCell.textContent = formatCurrency(txn.amount);
    amountCell.classList.add('text-right');
    row.appendChild(dateCell);
    row.appendChild(descCell);
    row.appendChild(catCell);
    row.appendChild(amountCell);
    tbody.appendChild(row);
  });
}

// Entry point: fetch data for the current month and year and render UI
async function initDashboard() {
  // Determine current month and year
  const now = new Date();
  const month = now.getMonth() + 1; // months are 0-indexed in JS
  const year = now.getFullYear();
  try {
    const [overview, transactions] = await Promise.all([
      fetchOverview(month, year),
      fetchTransactions(month, year),
    ]);
    renderKPIs(overview);
    renderLineChart(overview);
    renderDonutChart(overview);
    renderTransactions(transactions);
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

// Run the dashboard once the page has loaded
document.addEventListener('DOMContentLoaded', initDashboard);