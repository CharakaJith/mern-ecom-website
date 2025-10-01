export interface PurchaseItem {
  _id: string;
  itemId: string | { _id: string; name: string };
  price: number;
  quantity: number;
  size: string;
}

export interface Purchase {
  _id: string;
  userId: string | { _id: string; name: string };
  items: PurchaseItem[];
  totalPrice: number;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}
