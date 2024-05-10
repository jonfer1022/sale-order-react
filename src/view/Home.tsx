/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { Error, ISalesOrder, IUser, StatusOrder } from '../utils/interfaces';
import axiosInstance from '../utils/fetcher';
import { useNavigate } from 'react-router-dom';
import PaginationComponent from '../components/Pagination';
import CardSalesOrder from '../components/CardSalesOrder';
import {
  ModalDeleteSaleOrder,
  ModalUpdateSalesOrder,
} from '../components/Modals';

interface IHomeProps {
  setError: (error: Error) => void;
}

interface IResponseSales {
  count: number;
  rows: Array<ISalesOrder & { user: IUser | null }>;
}

const Home: React.FC<IHomeProps> = ({ setError }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [salesOrders, setSalesOrders] = useState<
    Array<ISalesOrder & { user: IUser | null }>
  >([]);
  const [status, setStatus] = useState<StatusOrder | null>(null);
  const [users, setUsers] = useState<Array<any>>([]);
  const [userSelected, setUserSelected] = useState<IUser | null>(null);
  const [salesOrderSelected, setSalesOrderSelected] = useState<
    ISalesOrder & { user: IUser | null }
  >({} as ISalesOrder & { user: IUser | null });
  const [showModalRemove, setShowModalRemove] = useState<boolean>(false);
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get(`/users`);
      setUsers(response.data);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
        navigate('/');
      } else setError({ message: 'Something went wrong', status: 500 });
    }
  };

  const fetchData = async () => {
    try {
      let _status = '';
      let _user = '';
      if (status) _status = `&status=${status}`;
      if (userSelected) {
        _user = `&userId=${userSelected.id}`;
      }
      const url = `/sales?page=${page}${_status}${_user}`;
      const response = await axiosInstance.get<IResponseSales>(url);
      setSalesOrders(response.data.rows);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
        navigate('/');
      } else setError({ message: 'Something went wrong', status: 500 });
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/sales/${salesOrderSelected.id}`);
      setShowModalRemove(false);
      setSalesOrderSelected({} as ISalesOrder & { user: IUser | null });
      fetchData();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
        navigate('/');
      } else setError({ message: 'Something went wrong', status: 500 });
    }
  };

  const handleUpdate = async (
    status: StatusOrder | null,
    user: IUser | null,
  ) => {
    try {
      await axiosInstance.put(`/sales/${salesOrderSelected.id}`, {
        status,
        registeredBy: user?.id || null,
      });
      setShowModalUpdate(false);
      setSalesOrderSelected({} as ISalesOrder & { user: IUser | null });
      fetchData();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
        navigate('/');
      } else setError({ message: 'Something went wrong', status: 500 });
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, status, userSelected]);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Container className="mt-3">
      <h2>Sales Order</h2>
      <div className="p-3 rounded" style={{ background: '#f5f5fa' }}>
        <div
          className="p-3 mb-3 rounded d-flex justify-content-between"
          style={{ background: 'white' }}
        >
          <div className="col-6 "></div>
          <div className="col-2">
            <Dropdown className="d-inline">
              <Dropdown.Toggle
                id="dropdown-autoclose-true"
                className="col-12"
                style={{ background: 'gray', borderColor: 'gray' }}
              >
                {status ? status : 'Select status'}
              </Dropdown.Toggle>

              <Dropdown.Menu className="w-100">
                <Dropdown.Item onClick={() => setStatus(StatusOrder.INVOICED)}>
                  {StatusOrder.INVOICED}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStatus(StatusOrder.PACKED)}>
                  {StatusOrder.PACKED}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStatus(StatusOrder.SHIPPED)}>
                  {StatusOrder.SHIPPED}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStatus(StatusOrder.REJECTED)}>
                  {StatusOrder.REJECTED}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setStatus(null)}>
                  By Default
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="col-3 px-3">
            <Dropdown className="d-inline">
              <Dropdown.Toggle
                id="dropdown-autoclose-true"
                className="col-12"
                style={{ background: 'gray', borderColor: 'gray' }}
              >
                {userSelected ? userSelected.name : 'Select user'}
              </Dropdown.Toggle>

              <Dropdown.Menu className="w-100">
                {users.map((user) => (
                  <Dropdown.Item
                    key={user.id}
                    onClick={() => setUserSelected(user)}
                  >
                    {user.name}
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setUserSelected(null)}>
                  By Default
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="d-flex justify-content-between mb-3 px-3">
          <div className="col-3">
            <strong>Reference:</strong>
          </div>
          <div className="col-3 d-flex align-items-center justify-content-around">
            <div>
              <span>Invoiced</span>
            </div>
            <div>
              <span>Packed</span>
            </div>
            <div>
              <span>Shipped</span>
            </div>
            <div>
              <span>Rejected</span>
            </div>
          </div>
          <div className="col-2 d-flex justify-content-center">
            <span>Registered By</span>
          </div>
          <div className="col-1 d-flex justify-content-center">
            <span>Amount</span>
          </div>
          <div className="col-2 d-flex justify-content-center">
            <span>Total Price</span>
          </div>
          <div className="col-1 d-flex justify-content-center">
            <span>Actions</span>
          </div>
        </div>
        {salesOrders.map((saleOrder) => (
          <CardSalesOrder
            items={saleOrder}
            key={saleOrder.id}
            onDelete={() => {
              setSalesOrderSelected(saleOrder);
              setShowModalRemove(true);
            }}
            onEdit={() => {
              setSalesOrderSelected(saleOrder);
              setShowModalUpdate(true);
            }}
            onDetails={() => console.log(saleOrder)}
          />
        ))}
        <PaginationComponent
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
      <ModalDeleteSaleOrder
        show={showModalRemove}
        onClose={() => setShowModalRemove(false)}
        item={salesOrderSelected}
        onConfirm={handleDelete}
      />
      <ModalUpdateSalesOrder
        item={salesOrderSelected}
        show={showModalUpdate}
        onClose={() => setShowModalUpdate(false)}
        onConfirm={handleUpdate}
        users={users}
      />
    </Container>
  );
};

export default Home;
