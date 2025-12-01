import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    api
      .get(`/products/${id}`)
      .then((d) => {
        if (mounted) {
          setProduct(d);
          setSelectedVariant(d.variants?.[0]?.id ?? null);
        }
      })
      .catch((e) => {
        console.error(e);
        alert("Failed to load product");
      });
    return () => (mounted = false);
  }, [id]);

  async function addToCart() {
    if (!user) return alert("Please login first");
    if (!selectedVariant) return alert("Choose a variant");
    try {
      await api.post("/cart/add", {
        variant_id: selectedVariant,
        qty: Number(qty),
      });
      alert("Added to cart");
    } catch (err) {
      alert(err.data?.error || err.message);
    }
  }

  if (!product) return <div>Loading product...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "10px auto" }}>
      <h2>{product.title}</h2>
      <p>{product.description}</p>

      <div style={{ marginTop: 12 }}>
        <label>
          Variant:{" "}
          <select
            value={selectedVariant ?? ""}
            onChange={(e) => setSelectedVariant(Number(e.target.value))}
          >
            {product.variants?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name || "Default"} — Rs {v.price}{" "}
                {v.stock !== undefined ? `(stock ${v.stock})` : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>
          Qty:{" "}
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            style={{ width: 80 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={addToCart}>Add to cart</button>
      </div>
    </div>
  );
}
