// src/services/checkoutService.test.ts
import { CheckoutService } from "./checkoutService";
import { CartItem } from "../models/CartItem";

describe("CheckoutService", () => {
  let checkoutService: CheckoutService;

  beforeEach(() => {
    checkoutService = new CheckoutService();
  });

  test("should apply promotion for Google Home: buy 3 for price of 2", () => {
    const cartItems: CartItem[] = [{ sku: "120P90", quantity: 3 }];
    const result = checkoutService.checkout(cartItems);
    // Google Home price is 49.99, so effective quantity = 2 and total = 2 * 49.99
    expect(result.total).toBeCloseTo(2 * 49.99, 2);
    expect(result.promotionsApplied).toContain("Google Home promotion applied: groups of 3 cost the price of 2.");
  });

  test("should apply promotion for Mac Pro and include free Raspberry Pi", () => {
    const cartItems: CartItem[] = [
      { sku: "43N23P", quantity: 1 },
      // Even if a Raspberry Pi is scanned, it should be free due to the promotion.
      { sku: "344222", quantity: 1 }
    ];
    const result = checkoutService.checkout(cartItems);
    // Total should be only the Mac Pro price.
    expect(result.total).toBeCloseTo(5399.99, 2);
    expect(result.promotionsApplied).toContain("Mac Pro promotion applied: each sale includes a free Raspberry Pi.");
  });

  test("should apply 10% discount on Alexa Speakers when buying more than 3", () => {
    const cartItems: CartItem[] = [{ sku: "A304SD", quantity: 4 }];
    const result = checkoutService.checkout(cartItems);
    // Each Alexa Speaker is 109.50; with 10% discount, unit price becomes 98.55, total ~394.20.
    expect(result.total).toBeCloseTo(4 * 98.55, 2);
    expect(result.promotionsApplied).toContain("Alexa Speaker promotion applied: 10% discount on all Alexa speakers.");
  });
});
