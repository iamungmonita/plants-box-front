export interface ILayout<T> {
  success: boolean;
  message?: string;
  data?: T;
  name?: string;
  errors?: any;
}

export interface Response {
  _v: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface queryParam {
  search?: string;
  category?: string;
  type?: string;
  purchasedId?: string;
  date?: string;
  start?: string;
  end?: string;
  phoneNumber?: string;
  barcode?: string;
}
