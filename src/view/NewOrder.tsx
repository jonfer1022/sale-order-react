/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button, Container, Row } from 'react-bootstrap';
import {
  Error,
  ICustomer,
  IProduct,
  ISize,
  ITypeProduct,
  StatusOrder,
} from '../utils/interfaces';
import axiosInstance from '../utils/fetcher';
import { useNavigate } from 'react-router-dom';

interface INewOrderProps {
  setError: (error: Error) => void;
}

interface IResponseProduct extends IProduct {
  type: ITypeProduct;
  size: ISize;
}

const NewOrder: React.FC<INewOrderProps> = ({ setError }) => {
  const [customers, setCustomers] = useState<Array<ICustomer>>([]);
  const [customerSelected, setCustomerSelected] = useState<ICustomer | null>();
  const [products, setProducts] = useState<Array<IResponseProduct>>([]);
  const [productSelected, setProductSelected] =
    useState<IResponseProduct | null>();
  const [quantity, setQuantity] = useState<number>(0);
  const [status, setStatus] = useState<StatusOrder | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const navigate = useNavigate();

  const getCustomers = async () => {
    try {
      const response = await axiosInstance.get<Array<ICustomer>>('/customers');
      setCustomers(response.data);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
      } else setError({ message: 'Something went wrong', status: 500 });
    }
  };

  const getProducts = async () => {
    try {
      const response =
        await axiosInstance.get<Array<IResponseProduct>>('/products');
      setProducts(response.data);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
      } else setError({ message: 'Something went wrong', status: 500 });
    }
  };

  const handleCreateOrder = async () => {
    try {
      if (customerSelected && productSelected) {
        await axiosInstance.post('/sales', {
          customerId: customerSelected.id,
          productId: productSelected.id,
          quantity,
          status,
          isRegistered,
        });
        setCustomerSelected(null);
        setProductSelected(null);
        setQuantity(0);
        setStatus(null);
        setIsRegistered(false);
        navigate('/home');
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
      } else setError({ message: 'Something went wrong', status: 500 });
    }
  };

  useEffect(() => {
    getCustomers();
    getProducts();
  }, []);

  return (
    <Container className="mt-2">
      <h2>New Sale Order</h2>
      <Form className="d-flex flex-column">
        <Form.Group className="col-6 mb-2">
          <Form.Label>Select the customer</Form.Label>
          <Form.Select
            onChange={(e) => {
              const selectedCustomer = customers.find(
                (customer) => customer.id === e.target.value,
              );
              if (!selectedCustomer) setCustomerSelected(null);
              else setCustomerSelected(selectedCustomer);
            }}
          >
            <option>Select customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Row className="mb-2">
          <Form.Group className="col-6">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              value={customerSelected?.name || ''}
              disabled
            />
          </Form.Group>
          <Form.Group className="col-6">
            <Form.Label>Customer Email</Form.Label>
            <Form.Control
              type="text"
              value={customerSelected?.email || ''}
              disabled
            />
          </Form.Group>
        </Row>
        <Row className="mb-2">
          <Form.Group className="col-6">
            <Form.Label>Customer Phone</Form.Label>
            <Form.Control
              type="text"
              value={customerSelected?.phone || ''}
              disabled
            />
          </Form.Group>
          <Form.Group className="col-6">
            <Form.Label>Customer Address</Form.Label>
            <Form.Control
              type="text"
              value={customerSelected?.address || ''}
              disabled
            />
          </Form.Group>
        </Row>
        <Form.Group className="col-6 mb-2">
          <Form.Label>Select the product</Form.Label>
          <Form.Select
            onChange={(e) => {
              const selectedProduct = products.find(
                (product) => product.id === e.target.value,
              );
              if (!selectedProduct) setProductSelected(null);
              else setProductSelected(selectedProduct);
            }}
          >
            <option>Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Row className="mb-2">
          <Form.Group className="col-6">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              value={productSelected?.name || ''}
              disabled
            />
          </Form.Group>
          <Form.Group className="col-6">
            <Form.Label>Product Type</Form.Label>
            <Form.Control
              type="text"
              value={productSelected?.type.name || ''}
              disabled
            />
          </Form.Group>
        </Row>
        <Row className="mb-2">
          <Form.Group className="col-6">
            <Form.Label>Product Size</Form.Label>
            <Form.Control
              type="text"
              value={productSelected?.size.value || ''}
              disabled
            />
          </Form.Group>
          <Form.Group className="col-6">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="text"
              value={productSelected?.color || 0}
              disabled
            />
          </Form.Group>
        </Row>
        <Row className="mb-2">
          <Form.Group className="col-6">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              value={Number(productSelected?.stock || 0) - quantity || 0}
              disabled
            />
          </Form.Group>
          <Form.Group className="col-6">
            <Form.Label>Product Price per unit</Form.Label>
            <Form.Control
              type="text"
              value={productSelected?.price || ''}
              disabled
            />
          </Form.Group>
        </Row>
        <Row className="mb-2">
          <Form.Group className="col-12">
            <Form.Label>Description</Form.Label>
            <Form.Control
              disabled
              type="test"
              value={productSelected?.description}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="col-3">
            <Form.Label>How many items do you want to order?</Form.Label>
            <Form.Control
              disabled={!customerSelected || !productSelected}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </Form.Group>
          <Form.Group className="col-3">
            <Form.Label>What is the status of the order?</Form.Label>
            <Form.Select
              disabled={!customerSelected || !productSelected}
              onChange={(e) => {
                setStatus(e.target.value as StatusOrder);
              }}
            >
              <option>Select status</option>
              {Object.values(StatusOrder).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="col-6 d-flex align-items-end">
            <Form.Check
              label={`Will it be registered by yourself?`}
              type="checkbox"
              disabled={!customerSelected || !productSelected}
              onChange={(e) => setIsRegistered(e.target.checked)}
            />
          </Form.Group>
        </Row>
        <Row className="d-flex justify-content-center">
          <Button
            className="mt-3 col-12"
            disabled={
              !customerSelected || !productSelected || !quantity || !status
            }
            onClick={handleCreateOrder}
          >
            Create Order
          </Button>
        </Row>
      </Form>
    </Container>
  );
};

export default NewOrder;
