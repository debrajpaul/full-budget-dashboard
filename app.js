// Configuration: adjust the endpoint to match your back-end.  If your back-end
// GraphQL server is running locally on port 4005 (the default for the
// full-budget-app), the endpoint will be something like http://localhost:4005/graphql.
const GRAPHQL_ENDPOINT = 'https://3w4l21wyp3.execute-api.ap-south-1.amazonaws.com/dev/graphql';

// Provide a JWT token here if your GraphQL API requires authentication.
// You can store the token in localStorage after login, or hard-code it for
// testing. Leave empty if your API is public (not recommended in production).
let AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJnb29nbGVAZ21haWwuY29tIiwiZW1haWwiOiJnb29nbGVAZ21haWwuY29tIiwidGVuYW50SWQiOiJQRVJTT05BTCIsImlhdCI6MTc2NTk3MDQ3MCwiZXhwIjoxNzY1OTc0MDcwfQ.ktRY3pcWim9MGn4jOVf8JwJcUZsqAnTSM72cn-1UNtc';

// Format numbers as currency
function formatCurrency(value) {
  const num = Number(value);
  const safe = Number.isFinite(num) ? num : 0;
  return safe.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
          debit
          credit
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
  if (!review) return;
  document.getElementById('kpi-income').textContent = formatCurrency(review.totalIncome ?? 0);
  document.getElementById('kpi-expenses').textContent = formatCurrency(review.totalExpenses ?? 0);
  document.getElementById('kpi-savings').textContent = formatCurrency(review.savings ?? 0);
  // Calculate budget from series (sum of budget values)
  const budgetTotal = (review.series || []).reduce((total, entry) => {
    const budget = Number(entry?.budget);
    return total + (Number.isFinite(budget) ? budget : 0);
  }, 0);
  document.getElementById('kpi-budget').textContent = formatCurrency(budgetTotal);
}

// Render the line chart for budget vs actual using Chart.js
function renderLineChart(review) {
  const series = review?.series ?? [];
  const hasData = Array.isArray(series) && series.length > 0;
  const labels = hasData
    ? series.map((entry) =>
        new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      )
    : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const budgetData = hasData
    ? series.map((entry) => Number(entry?.budget) || 0)
    : [50000, 50000, 50000, 50000];
  const actualData = hasData
    ? series.map((entry) => Number(entry?.actual) || 0)
    : [48000, 52000, 49000, 51000];
  const ctx = document.getElementById('lineChart').getContext('2d');
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
  if (!review) return;
  const ctx = document.getElementById('donutChart').getContext('2d');
  const labels = review.categoryBreakdown?.map((item) => item.name) ?? [];
  // Chart.js doughnut slices don't handle negative values well, so use absolute magnitudes.
  const values = review.categoryBreakdown?.map((item) => Math.abs(item.amount ?? 0)) ?? [];
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
  // Cap the number of rendered rows to avoid runaway page height when the
  // API returns a very large result set.
  const rows = transactions.slice(0, 200);
  rows.forEach((txn) => {
    const row = document.createElement('tr');
    const dateCell = document.createElement('td');
    const descCell = document.createElement('td');
    const catCell = document.createElement('td');
    const amountCell = document.createElement('td');
    dateCell.textContent = new Date(txn.date).toLocaleDateString('en-US');
    descCell.textContent = txn.description;
    catCell.textContent = txn.category;
    const amount = txn.amount ?? (txn.credit ?? 0) - (txn.debit ?? 0);
    amountCell.textContent = formatCurrency(amount);
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
  // const month = now.getMonth() + 1; // months are 0-indexed in JS
  // const year = now.getFullYear();
  const month = 4; // months are 0-indexed in JS
  const year = 2025;
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
