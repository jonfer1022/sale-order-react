export enum StatusOrder {
  INVOICED = 'invoiced',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  REJECTED = 'rejected',
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface ICustomer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  color: string;
}

export interface ITypeProduct {
  id: string;
  name: string;
}

export interface ISize {
  id: string;
  value: string;
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
