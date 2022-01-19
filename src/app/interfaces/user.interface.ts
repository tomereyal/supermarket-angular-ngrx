export default interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
  address: { city: string; street: string };
  isAdmin: boolean;
  token: string;
}
