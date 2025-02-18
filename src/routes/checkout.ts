import { Router } from "express";
import { CheckoutService } from "../services/checkoutService";

const router = Router();
const checkoutService = new CheckoutService();

router.post("/checkout", (req, res) => {
  try {
    const cartItems = req.body; // expect JSON array of { sku: string, quantity: number }
    const result = checkoutService.checkout(cartItems);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during checkout." });
  }
});

export default router;
