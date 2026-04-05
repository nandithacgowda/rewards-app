import { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import logger from "../logger";
import fetchTransactions from "../services/api.js";
import rewardCalculator from "../utils/rewardCalculator.js";
import { ITEMS_PER_PAGE, MESSAGES } from "../constants/appConstants";
import CustomerTable from "../components/customerTable";
import CustomerDetails from "../components/customerDetails";
const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 16px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #1a1a2e;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 32px;
  font-size: 2rem;
  color: #16213e;
`;

const Loading = styled.div`
  text-align: center;
  padding: 48px;
  font-size: 1.2rem;
  color: #555;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 48px;
  color: #e74c3c;
  font-size: 1.1rem;
`;

const RewardsApp = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerPage, setCustomerPage] = useState(1);

  useEffect(() => {
    logger.info("RewardsApp mounted, fetching data...");
    fetchTransactions()
      .then((data) => {
        setTransactions(data);
        setLoading(false);
        logger.info(`Loaded ${data.length} transactions`);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        logger.error({ error: err.message }, "Failed to load transactions");
      });
  }, []);

  const customers = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (!map[t.customerId]) {
        map[t.customerId] = {
          customerId: t.customerId,
          customerName: t.customerName,
          totalRewards: 0,
        };
      }
      map[t.customerId].totalRewards += rewardCalculator(t.amount);
    });
    return Object.values(map);
  }, [transactions]);

  const handleSelectCustomer = useCallback((customerId) => {
    logger.info(`Customer selected: ${customerId}`);
    setSelectedCustomer(customerId);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedCustomer(null);
  }, []);

  if (loading)
    return (
      <Container>
        <Loading>{MESSAGES.loading}</Loading>
      </Container>
    );
  if (error)
    return (
      <Container>
        <ErrorMessage>{MESSAGES.error}</ErrorMessage>
      </Container>
    );

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const pagedCustomers = customers.slice(
    (customerPage - 1) * ITEMS_PER_PAGE,
    customerPage * ITEMS_PER_PAGE,
  );

  return (
    <Container>
      <Title>Customer Rewards Program</Title>
      {selectedCustomer ? (
        <CustomerDetails
          customerId={selectedCustomer}
          transactions={transactions.filter(
            (t) => t.customerId === selectedCustomer,
          )}
          onBack={handleBack}
        />
      ) : (
        <CustomerTable
          customers={pagedCustomers}
          currentPage={customerPage}
          totalPages={totalPages}
          onPageChange={setCustomerPage}
          onSelectCustomer={handleSelectCustomer}
        />
      )}
    </Container>
  );
};

export default RewardsApp;
