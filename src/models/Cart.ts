export interface ShoppingCartProduct {
  _id: string;
  price: number;
  stock: number;
  quantity: number;
  name: string;
  discount: string;
  isDiscountable: boolean;
  convertedPoints: number;
}
