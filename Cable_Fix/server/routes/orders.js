const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/auth");

// create order from cart
router.post("/create", auth, async (req, res) => {
  const userId = req.user.id;
  const shipping_address = req.body.shipping_address || null;
  // fetch cart items
  const [carts] = await pool.query("SELECT * FROM carts WHERE user_id = ?", [
    userId,
  ]);
  if (!carts.length) return res.status(400).json({ error: "no cart" });
  const cart = carts[0];
  const [items] = await pool.query(
    `SELECT ci.qty, v.id as variant_id, v.price FROM cart_items ci JOIN product_variants v ON v.id = ci.variant_id WHERE ci.cart_id = ?`,
    [cart.id]
  );
  if (!items.length) return res.status(400).json({ error: "cart empty" });
  // compute total
  let total = 0;
  for (const it of items) total += Number(it.price) * it.qty;
  // create order
  const [orderRes] = await pool.query(
    "INSERT INTO orders (user_id, total, shipping_address) VALUES (?, ?, ?)",
    [userId, total, shipping_address]
  );
  const orderId = orderRes.insertId;
  // insert order items
  for (const it of items) {
    await pool.query(
      "INSERT INTO order_items (order_id, variant_id, qty, price) VALUES (?, ?, ?, ?)",
      [orderId, it.variant_id, it.qty, it.price]
    );
    // optional: reduce stock
    await pool.query(
      "UPDATE product_variants SET stock = GREATEST(stock - ?, 0) WHERE id = ?",
      [it.qty, it.variant_id]
    );
  }
  // clear cart
  await pool.query("DELETE FROM cart_items WHERE cart_id = ?", [cart.id]);
  res.json({ success: true, orderId });
});

module.exports = router;
