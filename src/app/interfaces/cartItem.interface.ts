import IProduct from './product.interface';

export default interface ICartItem {
  _id: string;
  amount: number;
  productRef: IProduct;
}
