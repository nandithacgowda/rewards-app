export const MONTHS = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

export const YEARS = [2025, 2024, 2023, 2022, 2021];

export const ITEMS_PER_PAGE = 5;

export const DEFAULT_RECENT_MONTHS = 3;

export const MESSAGES = {
  loading: "Loading transactions...",
  error: "Failed to fetch transactions. Please try again.",
  noTransactions: "No transactions found for the selected period.",
  noCustomers: "No customers found.",
};

export const TABLE_HEADERS = {
  customers: ["Customer ID", "Customer Name", "Total Rewards"],
  transactions: ["Transaction ID", "Date", "Amount ($)", "Reward Points"],
  monthlySummary: ["Month", "Year", "Reward Points"],
};
