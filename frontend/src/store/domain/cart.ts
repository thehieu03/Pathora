export interface CartItem {
  id: string;
  name: string;
  price: number;
  img?: string;
  brand?: string;
  quantity: number;
}

export interface CartFilters {
  search: string;
  category: string;
  price: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  filters: CartFilters;
}

export interface AddToCartPayload {
  id: string;
  name: string;
  price: number;
  img?: string;
  brand?: string;
}

export interface UpdateQuantityPayload {
  id: string;
  quantity: number;
}
