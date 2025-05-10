import { IProduct } from "../Models/ProductModel.";

export interface IOrderForm {
    payment: 'card' | 'cash' | '';
    address: string;
    email: string;
    phone: string;
}

export interface OrderFormViewData extends IOrderForm {
    valid: boolean;
    errors: FormErrors;
}

export interface ContactsFormViewData extends IOrderForm {
    valid: boolean;
    errors: FormErrors;
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export interface IApiResponse {
    total: number;
    items: IProduct[];
}

export interface ApiResponse<T> {
    total: number;
    items: T[];
    error?: string;
}

export interface ApiOrderResponse {
    id: string;
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;