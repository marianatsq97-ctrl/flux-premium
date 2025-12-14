export function createPageUrl(pageName) {
  const map = {
    Dashboard: '/',
    Transactions: '/transactions',
    Bills: '/bills',
    Charts: '/charts',
    Insights: '/insights',
    Forecast: '/forecast',
    Cards: '/cards',
    Investments: '/investments',
    Loans: '/loans',
    Fuel: '/fuel',
  };
  return map[pageName] ?? '/';
}
