import { CartItem } from "../models/CartItem";
import { findProductBySKU, products } from "../data/products";
import { Product } from "../models/Product";

export interface CheckoutResult {
  total: number;
  items: {
    product: Product;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
  promotionsApplied: string[];
}

export class CheckoutService {
  /**
   * Calculates the total price and applies promotions.
   * @param cartItems List of scanned items (SKU and quantity)
   */
  public checkout(cartItems: CartItem[]): CheckoutResult {
    // First, build a map from SKU to quantity.
    const cartMap = new Map<string, number>();
    cartItems.forEach(item => {
      cartMap.set(item.sku, (cartMap.get(item.sku) || 0) + item.quantity);
    });

    const promotions: string[] = [];

    // Promotion 1: Buy 3 Google Homes for the price of 2.
    if (cartMap.has("120P90")) {
      const quantity = cartMap.get("120P90")!;
      // Every group of 3 costs 2 times the price
      const groups = Math.floor(quantity / 3);
      const remainder = quantity % 3;
      // We can store an effective quantity for charging:
      const effectiveQuantity = groups * 2 + remainder;
      cartMap.set("120P90", effectiveQuantity);
      promotions.push("Google Home promotion applied: groups of 3 cost the price of 2.");
    }

    // Promotion 2: Each sale of a Mac Pro (43N23P) comes with a free Raspberry Pi (344222).
    // If the cart contains a Mac Pro, we add (or ensure) one free Raspberry Pi for each Mac Pro.
    if (cartMap.has("43N23P")) {
      const macProQty = cartMap.get("43N23P")!;
      // Set Raspberry Pi quantity to at least macProQty (if not already present)
      const existingPiQty = cartMap.get("344222") || 0;
      if (existingPiQty < macProQty) {
        // We add the missing quantity as free items (price zero)
        cartMap.set("344222", macProQty);
      }
      promotions.push("Mac Pro promotion applied: each sale includes a free Raspberry Pi.");
    }

    // Promotion 3: Buying more than 3 Alexa Speakers gets a 10% discount on all Alexa speakers.
    let alexaDiscount = false;
    if (cartMap.has("A304SD")) {
      const quantity = cartMap.get("A304SD")!;
      if (quantity > 3) {
        alexaDiscount = true;
        promotions.push("Alexa Speaker promotion applied: 10% discount on all Alexa speakers.");
      }
    }

    // Now calculate the total and prepare the detailed items.
    const items: {
      product: Product;
      quantity: number;
      unitPrice: number;
      discount?: number;
    }[] = [];

    let total = 0;
    cartMap.forEach((quantity, sku) => {
      const product = findProductBySKU(sku);
      if (!product) return;
      let price = product.price;
      let discount = 0;

      // Apply discount for Alexa Speakers if eligible.
      if (sku === "A304SD" && alexaDiscount) {
        discount = 0.10;
        price = price * (1 - discount);
      }
      // For Raspberry Pi added free with Mac Pro, price becomes zero.
      if (sku === "344222" && cartItems.find(item => item.sku === "43N23P")) {
        // Check if this Raspberry Pi is free because of promotion:
        price = 0;
      }

      total += price * quantity;
      items.push({ product, quantity, unitPrice: price, discount });
    });

    // Round the total to 2 decimal places.
    total = parseFloat(total.toFixed(2));

    return { total, items, promotionsApplied: promotions };
  }
}
