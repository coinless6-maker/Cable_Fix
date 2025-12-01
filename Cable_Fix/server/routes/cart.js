const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/auth");

// ensure cart exists for user
async function getOrCreateCart(userId) {
  const [rows] = await pool.query("SELECT * FROM carts WHERE user_id = ?", [
    userId,
  ]);
  if (rows.length) return rows[0];
  const [res] = await pool.query("INSERT INTO carts (user_id) VALUES (?)", [
    userId,
  ]);
  const [newC] = await pool.query("SELECT * FROM carts WHERE id = ?", [
    res.insertId,
  ]);
  return newC[0];
}

// add to cart
router.post("/add", auth, async (req, res) => {
  const userId = req.user.id;
  const { variant_id, qty } = req.body;
  const cart = await getOrCreateCart(userId);
  // check if item exists
  const [rows] = await pool.query(
    "SELECT * FROM cart_items WHERE cart_id = ? AND variant_id = ?",
    [cart.id, variant_id]
  );
  if (rows.length) {
    await pool.query("UPDATE cart_items SET qty = qty + ? WHERE id = ?", [
      qty || 1,
      rows[0].id,
    ]);
  } else {
    await pool.query(
      "INSERT INTO cart_items (cart_id, variant_id, qty) VALUES (?, ?, ?)",
      [cart.id, variant_id, qty || 1]
    );
  }
  res.json({ success: true });
});

// get cart
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;
  const [c] = await pool.query("SELECT * FROM carts WHERE user_id = ?", [
    userId,
  ]);
  if (!c.length) return res.json({ items: [] });
  const cart = c[0];
  const [items] = await pool.query(
    `SELECT ci.id, ci.qty, v.id as variant_id, v.name as variant_name, v.price, v.image, p.title as product_title
FROM cart_items ci
JOIN product_variants v ON v.id = ci.variant_id
JOIN products p ON p.id = v.product_id
WHERE ci.cart_id = ?`,
    [cart.id]
  );
  res.json({ items });
});

// remove item
router.post("/remove", auth, async (req, res) => {
  const userId = req.user.id;
  const { item_id } = req.body;
  await pool.query(
    "DELETE ci FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE c.user_id = ? AND ci.id = ?",
    [userId, item_id]
  );
  res.json({ success: true });
});

module.exports = router;
