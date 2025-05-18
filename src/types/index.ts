
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  rating?: number; // Optional
  reviews?: number; // Optional
}

export interface CartItem extends Product {
  quantity: number;
}
