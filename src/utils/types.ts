export enum StatusOrder {
  INVOICED = 'invoiced',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  REJECTED = 'rejected',
}

export interface ISalesOrder {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  shippedDate: Date;
  rejectedDate: Date;
  order: string;
  totalPrice: number;
  status: StatusOrder;
  registeredBy: string;
}

export interface Error {
  message: string;
  status: number;
}