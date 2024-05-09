import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import { Error, ISalesOrder } from '../utils/types';
import axiosInstance from '../utils/fetcher';
import { useNavigate } from 'react-router-dom';

interface IHomeProps {
  setError: (error: Error) => void
}

interface IResponseSales {
  count: number,
  rows: Array<ISalesOrder>
}

interface ICardSalesOrder {
  items: ISalesOrder
}

const CardSalesOrder: React.FC<ICardSalesOrder> = ({ items }) => {
  const [invoiced, setInvoiced] = useState(false);
  const [packed, setPacked] = useState(false);
  const [shipped, setShipped] = useState(false);
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    if (items.status === 'invoiced') setInvoiced(true);
    else if (items.status === 'packed') {
      setInvoiced(true);
      setPacked(true);
    }
    else if (items.status === 'shipped') {
      setInvoiced(true);
      setPacked(true);
      setShipped(true);
    }
    else if (items.status === 'rejected') {
      setRejected(true);
    }
  }, [items]);

  return (
    <div className="p-3 mb-1 rounded d-flex justify-content-between" style={{ background: 'white' }}>
      <div className="col-3">
        <span>{items.order}</span>
      </div>
      <div className="col-4 d-flex align-items-center justify-content-around">
        <div><Form.Check type="checkbox" checked={invoiced} readOnly /></div>
        <div><Form.Check type="checkbox" checked={packed} readOnly /></div>
        <div><Form.Check type="checkbox" checked={shipped} readOnly /></div>
        <div><Form.Check type="checkbox" checked={rejected} readOnly /></div>
      </div>
      <div className='col-2 d-flex justify-content-center'><span>{items.quantity}</span></div>
      <div className='col-3 d-flex justify-content-center'><span>{items.totalPrice}</span></div>
    </div>
  )
}

interface IPaginationProps {
  page: number
  setPage: (page: number) => void
  totalPages: number
}

const PaginationComponent: React.FC<IPaginationProps> = ({ page, setPage, totalPages }) => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <Pagination>
        <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
        {Array.from(Array(totalPages), (e, i) => i + 1).map((item) => <Pagination.Item key={item} active={item === page} onClick={() => setPage(item)}>{item}</Pagination.Item>)}
        <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === totalPages} />
      </Pagination>
    </div>
  )
}

const Home: React.FC<IHomeProps> = ({ setError }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [salesOrders, setSalesOrders] = useState<ISalesOrder[]>([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get<IResponseSales>(`/sales?page=${page}`);
      setSalesOrders(response.data.rows);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
        navigate('/');
      } else setError({ message: 'Something went wrong', status: 500 });
    }
  };

  return (
    <Container className='mt-4'>
      <h1>Sales Order</h1>
      <div className="p-3 rounded" style={{ background: '#f5f5fa' }}>
        <div className="d-flex justify-content-between mb-3 px-3">
          <div className='col-3'><strong>Reference:</strong></div>
          <div className="col-4 d-flex align-items-center justify-content-around">
            <div><span>Invoiced</span></div>
            <div><span>Packed</span></div>
            <div><span>Shipped</span></div>
            <div><span>Rejected</span></div>
          </div>
          <div className='col-2 d-flex justify-content-center'><span>Amount</span></div>
          <div className='col-3 d-flex justify-content-center'><span>Total Price</span></div>
        </div>
        {salesOrders.map((saleOrder) => (
          <CardSalesOrder items={saleOrder} key={saleOrder.id} />
        ))}
        <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </Container>
  )
}

export default Home;