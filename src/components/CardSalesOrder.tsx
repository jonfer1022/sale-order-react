import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { ISalesOrder, IUser } from '../utils/interfaces';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { Dropdown } from 'react-bootstrap';

interface ICardSalesOrder {
  items: ISalesOrder & { user: IUser | null };
  onDelete: () => void;
  onEdit: () => void;
  onDetails: () => void;
}

const CardSalesOrder: React.FC<ICardSalesOrder> = ({
  items,
  onDelete,
  onEdit,
  onDetails,
}) => {
  const [invoiced, setInvoiced] = useState<boolean>(false);
  const [packed, setPacked] = useState<boolean>(false);
  const [shipped, setShipped] = useState<boolean>(false);
  const [rejected, setRejected] = useState<boolean>(false);

  useEffect(() => {
    if (items.status === 'invoiced') setInvoiced(true);
    else if (items.status === 'packed') {
      setInvoiced(true);
      setPacked(true);
    } else if (items.status === 'shipped') {
      setInvoiced(true);
      setPacked(true);
      setShipped(true);
    } else if (items.status === 'rejected') {
      setRejected(true);
    }
  }, [items]);

  return (
    <div
      className="p-3 mb-1 rounded d-flex justify-content-between"
      style={{ background: 'white' }}
    >
      <div className="col-3">
        <span>{items.order}</span>
      </div>
      <div className="col-3 d-flex align-items-center justify-content-around">
        <div>
          <Form.Check type="checkbox" checked={invoiced} readOnly />
        </div>
        <div>
          <Form.Check type="checkbox" checked={packed} readOnly />
        </div>
        <div>
          <Form.Check type="checkbox" checked={shipped} readOnly />
        </div>
        <div>
          <Form.Check type="checkbox" checked={rejected} readOnly />
        </div>
      </div>
      <div className="col-2 d-flex justify-content-center">
        <span>{items.user?.name}</span>
      </div>
      <div className="col-1 d-flex justify-content-center">
        <span>{items.quantity}</span>
      </div>
      <div className="col-2 d-flex justify-content-center">
        <span>{items.totalPrice}</span>
      </div>
      <div className="col-1 d-flex justify-content-center">
        <Dropdown className="d-inline">
          <Dropdown.Toggle variant="light" id="dropdown-autoclose-true">
            <ThreeDotsVertical size={20} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={onDetails}>Details</Dropdown.Item>
            <Dropdown.Item onClick={onEdit}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={onDelete}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default CardSalesOrder;
