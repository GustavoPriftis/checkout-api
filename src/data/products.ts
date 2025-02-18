import { Product } from "../models/Product";

export const products: Product[] = [
  { sku: "120P90", name: "Google Home", price: 49.99 },
  { sku: "43N23P", name: "Mac Pro", price: 5399.99 }, // or "MacBook Pro" if you prefer
  { sku: "A304SD", name: "Alexa Speaker", price: 109.50 },
  { sku: "344222", name: "Raspberry Pi", price: 30.00 }
];

export function findProductBySKU(sku: string): Product | undefined {
  return products.find(p => p.sku === sku);
}
