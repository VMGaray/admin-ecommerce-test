
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  description?: string;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  imageUrl?: string;
  categoryId: string;
  category?: Category; 
}

export interface SaleItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}

export interface Sale {
  id: string;
  createdAt: string;
  total: number;
  items: SaleItem[]; 
}


export interface AnalyticsData {
  name: string;
  value: number;
}