import React, { useEffect, useState } from 'react';
import { ISalesOrder, IUser, StatusOrder } from '../utils/interfaces';
import { Modal, Button, Dropdown, Row, Col } from 'react-bootstrap';

interface IModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: ISalesOrder & { user: IUser | null };
}
export const ModalDeleteSaleOrder: React.FC<IModalProps> = ({
  item,
  show,
  onClose,
  onConfirm,
}) => {
  const blockAction = item?.status === StatusOrder.SHIPPED;
  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Delete Sales Order
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>
          {blockAction
            ? 'You cannot delete an order that has been shipped'
            : 'Are you sure you want to delete this order?'}
        </h5>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="danger"
          disabled={blockAction}
          onClick={() => onConfirm()}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

interface IModalUpdateProps {
  item: ISalesOrder & { user: IUser | null };
  show: boolean;
  onClose: () => void;
  users: Array<IUser>;
  onConfirm: (status: StatusOrder | null, user: IUser | null) => void;
}

export const ModalUpdateSalesOrder: React.FC<IModalUpdateProps> = ({
  item,
  show,
  users,
  onClose,
  onConfirm,
}) => {
  const [status, setStatus] = useState<StatusOrder | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (item) {
      setStatus(item.status);
      setUser(item.user);
    }
  }, [item]);

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Sales Order
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <h5>Select status</h5>
            <Dropdown className="d-inline w-100">
              <Dropdown.Toggle className="w-100">
                {status ? status : 'Select status'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setStatus(StatusOrder.INVOICED)}>
                  Invoiced
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStatus(StatusOrder.PACKED)}>
                  Packed
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStatus(StatusOrder.SHIPPED)}>
                  Shipped
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStatus(StatusOrder.REJECTED)}>
                  Rejected
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md={6}>
            <h5>Select user to assign</h5>
            <Dropdown className="d-inline w-100">
              <Dropdown.Toggle className="w-100">
                {user ? user.name : 'Select user'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {users.map((user) => (
                  <Dropdown.Item
                    key={user.id}
                    onClick={() => setUser(user)}
                    disabled={user.id === item.user?.id}
                  >
                    {user.name}
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setUser(null)}>
                  None
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onConfirm(status, user)}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
