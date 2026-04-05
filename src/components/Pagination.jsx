import PropTypes from "prop-types";
import styled from "styled-components";

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 8px 0;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #16213e;
  background: ${(props) => (props.$active ? "#16213e" : "#fff")};
  color: ${(props) => (props.$active ? "#fff" : "#16213e")};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${(props) => (props.$active ? "#0f3460" : "#e8f4fd")};
  }
`;

const PageInfo = styled.span`
  font-size: 0.9rem;
  color: #555;
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <PaginationWrapper>
      <PageButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </PageButton>
      <PageInfo>
        Page {currentPage} of {totalPages}
      </PageInfo>
      <PageButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </PageButton>
    </PaginationWrapper>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
