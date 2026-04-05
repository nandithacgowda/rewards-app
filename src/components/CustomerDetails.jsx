import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import logger from "../logger.js";
import calculateRewards from "../utils/rewardCalculator.js";
import {
  MONTHS,
  YEARS,
  ITEMS_PER_PAGE,
  MESSAGES,
  TABLE_HEADERS,
} from "../constants/appConstants.js";
import Pagination from "./Pagination";

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const BackButton = styled.button`
  background: #16213e;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 0.95rem;
  &:hover {
    background: #0f3460;
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  background: #fff;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const Th = styled.th`
  background: #16213e;
  color: #fff;
  padding: 12px 14px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px 14px;
  border-bottom: 1px solid #e9ecef;
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
`;

const SummaryTh = styled.th`
  background: #e8f4fd;
  padding: 10px 14px;
  text-align: left;
  color: #16213e;
`;

const SummaryTd = styled.td`
  padding: 10px 14px;
  border-bottom: 1px solid #e9ecef;
`;

const TotalRow = styled.tr`
  font-weight: 700;
  background: #f0f7ff;
`;

const SectionTitle = styled.h3`
  margin: 20px 0 12px;
  color: #16213e;
`;

const NoData = styled.p`
  color: #888;
  text-align: center;
  padding: 24px;
`;

const CustomerName = styled.h2`
  margin: 0 0 20px;
  color: #16213e;
`;

const CustomerDetails = ({ customerId, transactions, onBack }) => {
  const latestDate = useMemo(() => {
    if (transactions.length === 0) return new Date();
    return transactions.reduce((max, t) => {
      const d = new Date(t.date);
      return d > max ? d : max;
    }, new Date(transactions[0].date));
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = useState("last3");
  const [selectedYear, setSelectedYear] = useState(latestDate.getFullYear());
  const [txnPage, setTxnPage] = useState(1);

  const customerName =
    transactions.length > 0 ? transactions[0].customerName : customerId;

  const filteredTransactions = useMemo(() => {
    logger.info(
      `Filtering transactions for ${customerId}, month=${selectedMonth}, year=${selectedYear}`,
    );
    return transactions.filter((t) => {
      const d = new Date(t.date);
      if (selectedMonth === "last3") {
        const threeMonthsAgo = new Date(
          latestDate.getFullYear(),
          latestDate.getMonth() - 2,
          1,
        );
        return d >= threeMonthsAgo && d <= latestDate;
      }
      if (selectedMonth === "all") {
        return d.getFullYear() === Number(selectedYear);
      }
      return (
        d.getMonth() === Number(selectedMonth) &&
        d.getFullYear() === Number(selectedYear)
      );
    });
  }, [transactions, selectedMonth, selectedYear, customerId, latestDate]);

  const monthlySummary = useMemo(() => {
    const map = {};
    filteredTransactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key]) {
        map[key] = { month: d.getMonth(), year: d.getFullYear(), points: 0 };
      }
      map[key].points += calculateRewards(t.amount);
    });
    return Object.values(map).sort(
      (a, b) => a.year - b.year || a.month - b.month,
    );
  }, [filteredTransactions]);

  const totalPoints = monthlySummary.reduce((s, m) => s + m.points, 0);

  const totalTxnPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const pagedTxns = filteredTransactions.slice(
    (txnPage - 1) * ITEMS_PER_PAGE,
    txnPage * ITEMS_PER_PAGE,
  );

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setTxnPage(1);
    logger.info(`Month filter changed to: ${e.target.value}`);
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
    if (selectedMonth === "last3") {
      setSelectedMonth("all");
    }
    setTxnPage(1);
    logger.info(`Year filter changed to: ${e.target.value}`);
  };

  return (
    <Card>
      <BackButton onClick={onBack}>← Back to Customers</BackButton>
      <CustomerName>
        {customerName} ({customerId})
      </CustomerName>

      <FilterRow>
        <Label htmlFor="monthFilter">Month:</Label>
        <Select
          id="monthFilter"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          <option value="last3">Last 3 Months</option>
          <option value="all">All Months</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </Select>

        <Label htmlFor="yearFilter">Year:</Label>
        <Select
          id="yearFilter"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      </FilterRow>

      <SectionTitle>Monthly Reward Summary</SectionTitle>
      {monthlySummary.length > 0 ? (
        <SummaryTable>
          <thead>
            <tr>
              {TABLE_HEADERS.monthlySummary.map((h) => (
                <SummaryTh key={h}>{h}</SummaryTh>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlySummary.map((m) => (
              <tr key={`${m.year}-${m.month}`}>
                <SummaryTd>{MONTHS[m.month].label}</SummaryTd>
                <SummaryTd>{m.year}</SummaryTd>
                <SummaryTd>{m.points}</SummaryTd>
              </tr>
            ))}
            <TotalRow>
              <SummaryTd colSpan={2}>Total</SummaryTd>
              <SummaryTd>{totalPoints}</SummaryTd>
            </TotalRow>
          </tbody>
        </SummaryTable>
      ) : (
        <NoData>{MESSAGES.noTransactions}</NoData>
      )}

      <SectionTitle>Transaction Details</SectionTitle>
      {pagedTxns.length > 0 ? (
        <>
          <Table>
            <thead>
              <tr>
                {TABLE_HEADERS.transactions.map((h) => (
                  <Th key={h}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedTxns.map((t) => (
                <tr key={t.transactionId}>
                  <Td>{t.transactionId}</Td>
                  <Td>{new Date(t.date).toLocaleDateString()}</Td>
                  <Td>${t.amount.toFixed(2)}</Td>
                  <Td>{calculateRewards(t.amount)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination
            currentPage={txnPage}
            totalPages={totalTxnPages}
            onPageChange={setTxnPage}
          />
        </>
      ) : (
        <NoData>{MESSAGES.noTransactions}</NoData>
      )}
    </Card>
  );
};

CustomerDetails.propTypes = {
  customerId: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      transactionId: PropTypes.string.isRequired,
      customerId: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default CustomerDetails;
