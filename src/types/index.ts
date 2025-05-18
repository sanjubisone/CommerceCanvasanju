
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  dataAiHint: string; // Added for AI image generation hints
  category: string;
  stock: number;
  rating?: number; // Optional
  reviews?: number; // Optional
}

export interface CartItem extends Product {
  quantity: number;
}
