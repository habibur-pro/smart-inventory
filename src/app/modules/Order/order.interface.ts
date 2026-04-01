export interface IOrderPayload {
  customerName: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  
}
