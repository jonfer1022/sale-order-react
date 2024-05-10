import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

interface IPaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const PaginationComponent: React.FC<IPaginationProps> = ({
  page,
  setPage,
  totalPages,
}) => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <Pagination>
        <Pagination.Prev
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        />
        {Array.from(Array(totalPages), (e, i) => i + 1).map((item) => (
          <Pagination.Item
            key={item}
            active={item === page}
            onClick={() => setPage(item)}
          >
            {item}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
