export interface ShoppingCartProduct {
  _id: string;
  price: number;
  stock: number;
  quantity: number;
  name: string;
  discount: string;
  isDiscountable: boolean;
  convertedPoints: number;
  pictures?: string;
  barcode: string;
}

export interface CartCardProps<ShoppingCartProduct> {
  item: ShoppingCartProduct;
  idx?: number;
  onDecrement?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  renderExtraInfo?: (item: ShoppingCartProduct) => React.ReactNode; // Allows custom content
}
