import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    api
      .get("/products")
      .then((d) => {
        if (mounted) setProducts(d);
      })
      .catch((e) => {
        console.error(e);
        alert("Failed to load products");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  async function addToCart(variantId) {
    if (!user) return alert("Please login first");
    try {
      await api.post("/cart/add", { variant_id: variantId, qty: 1 });
      alert("Added to cart");
    } catch (err) {
      alert(err.data?.error || err.message);
    }
  }

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h2>Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          gap: 12,
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{ border: "1px solid #eee", padding: 12, borderRadius: 6 }}
          >
            <h3>{p.title}</h3>
            <p style={{ minHeight: 40 }}>{p.description}</p>
            <div>
              {p.variants?.map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <div>
                    <strong>{v.name || "Default"}</strong> — Rs {v.price}{" "}
                    {v.stock !== undefined ? `(stock ${v.stock})` : ""}
                  </div>
                  <div>
                    <button
                      onClick={() => addToCart(v.id)}
                      style={{ marginRight: 8 }}
                    >
                      Add
                    </button>
                    <Link to={`/products/${p.id}`}>Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
