export interface IOrderCartItem {
  _id: string;
  amount: number;
  product: {
    _id: string;
    name: string;
    price: number;
    url: string;
    category: string;
  };
}

export interface IOrderCart {
  _id: string;
  createdAt: string;
  customerRef: string;
  cartItems: IOrderCartItem[];
}

export interface IOrderCustomer {
  firstName: string;
  lastName: string;
  address: { city: string; street: string };
  email: string;
  _id: string;
}

export default interface IOrder {
  _id: string;
  customer: IOrderCustomer;
  cart: IOrderCart;
  totalPrice: number;
  destination: { city: string; street: string };
  timeOfArrival: string;
  paymentDigits: number;
  createdAt: string;
}
