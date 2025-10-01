interface OrderItem {
  _id: string;
  itemId: string | { _id: string; name: string };
  price: number;
  quantity: number;
  size: string;
}

export interface Order {
  _id: string;
  displayId: string;
  userId: string | { _id: string; name: string };
  items: OrderItem[];
  totalPrice: number;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}
