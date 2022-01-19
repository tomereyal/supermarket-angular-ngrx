import ICartItem from './cartItem.interface';

export default interface ICart {
  _id: string;
  customerRef: string;
  createdAt: string;
  cartItems: ICartItem[] | any;
}
