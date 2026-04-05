import PropTypes from "prop-types";
import styled from "styled-components";
import { TABLE_HEADERS, MESSAGES } from "../constants/appConstants";
import Pagination from "./pagination";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const Th = styled.th`
  background: #16213e;
  color: #fff;
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #e8f4fd;
  }
`;

const CustomerTable = ({
  customers,
  currentPage,
  totalPages,
  onPageChange,
  onSelectCustomer,
}) => {
  if (!customers.length) {
    return <p>{MESSAGES.noCustomers}</p>;
  }

  return (
    <div>
      <Table>
        <thead>
          <tr>
            {TABLE_HEADERS.customers.map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <Tr
              key={c.customerId}
              onClick={() => onSelectCustomer(c.customerId)}
            >
              <Td>{c.customerId}</Td>
              <Td>{c.customerName}</Td>
              <Td>{c.totalRewards}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

CustomerTable.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      totalRewards: PropTypes.number.isRequired,
    }),
  ).isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSelectCustomer: PropTypes.func.isRequired,
};

export default CustomerTable;
