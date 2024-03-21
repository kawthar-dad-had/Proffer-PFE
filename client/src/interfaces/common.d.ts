import { GridFilterModel } from "@pankod/refine-mui";

export interface ILoginForm {
    email: string;
    password: string;
}

export interface IRegisterForm {
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    email: string;
    password: string;
    role: string;
}

export interface IUser {
    id: BaseKey | undefined;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    updatedAt: timestamp;
    createdAt: timestamp;
    role: string;
    active: boolean;
}

export interface BACKENDINFO {
    page: number;
    pageSize: number;
    total: number;
    filter: string | number[];
    sort: string | number[];
    rows: any[];
    refresh: boolean;
}

export interface BACKENDINFO2 {
    page: number;
    pageSize: number;
    total: number;
    filter: string | number[];
    sort: string | number[];
    rows: any[];
    refresh: boolean;
    filterModel: GridFilterModel | undefined;
}
export interface IProduct {
    id: number;
    name: string;
    isActive: boolean;
    description: string;
    images: IFile[];
    createdAt: string;
    price: number;
    category: ICategory;
    stock: number;
}

export interface ICategory {
    id: number;
    title: string;
    isActive: boolean;
}