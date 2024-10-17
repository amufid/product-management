export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sku: string;
  photo: string;
  categoryId: number;
  supplierId: number;
}

export interface DataProduct {
  data: Product[];
  paging: {
    currentPage: number;
    totalPages: number;
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id: number;
  productId: number;
  quantity: number;
  // type: string;
  totalPrice: number;
  destinationId: number;
  createdAt: string;
}

export interface Destination {
  id: number;
  name: string;
  address: string;
}

export interface Inventory {
  id: number;
  productId: number;
  locationId: number;
  quantity: number;
  createdAt: string;
}

export interface Location {
  id: number;
  code: string;
  description: string;
}

export interface User {
  id: number;
  username: number;
  email: number;
  role: string;
  approved: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
}
