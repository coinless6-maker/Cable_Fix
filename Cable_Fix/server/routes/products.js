const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// list products with variants
router.get("/", async (req, res) => {
  // return products and their variants
  const [products] = await pool.query("SELECT * FROM products");
  for (const p of products) {
    const [vars] = await pool.query(
      "SELECT * FROM product_variants WHERE product_id = ?",
      [p.id]
    );
    p.variants = vars;
  }
  res.json(products);
});

// single product
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [[product]] = await pool.query("SELECT * FROM products WHERE id = ?", [
    id,
  ]);
  if (!product) return res.status(404).json({ error: "not found" });
  const [vars] = await pool.query(
    "SELECT * FROM product_variants WHERE product_id = ?",
    [id]
  );
  product.variants = vars;
  res.json(product);
});

module.exports = router;
