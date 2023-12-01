import { ReactNode } from "react";

export interface IUser {
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  gender?: string;
  role: string;
}

export interface IUserForm {
  email: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  password: string;
}

export interface IProductForm {
  name: string;
  description?: string;
  currency: string;
  price: number;
  brandId: number;
}

export interface IError {
  errors: string[];
}

export interface IErrorResponse {
  message: string[];
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IProduct {
  id: number;
  name: string;
  description?: string;
  currency: string;
  price: number;
  brandId: number;
  createdAt: string;
  updatedAt: string;
  brand: IBrand;
}

export interface IBrand {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  products?: IProduct[];
}

export interface IBrandPartial {
  id: number;
  name: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IModal {
  show: boolean;
  setShow: (value: boolean) => void;
  children?: ReactNode;
}

export interface ICurrency {
  code: string;
  rate: number;
}

export interface IAppointmentData {
  name: string;
  startDate: string | null;
  endDate: string | null;
  userId: number;
}

export interface IAppointmentForm {
  name: string;
  dateRange: [Date | null, Date | null] | null;
  userId?: number;
}

export interface IAppointment {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  startDate: string;
  endDate: string;
  userId: string;
  user: IUser;
}
