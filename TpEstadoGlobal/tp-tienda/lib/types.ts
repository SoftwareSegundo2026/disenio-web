export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Comment {
  id: number;
  title: string;
  detail: string;
  createdAt: string;
}

export interface Order {
  id: number;
  customer: {
    nombre: string;
    email: string;
    direccion: string;
  };
  items: CartItem[];
  total: number;
  createdAt: string;
}
