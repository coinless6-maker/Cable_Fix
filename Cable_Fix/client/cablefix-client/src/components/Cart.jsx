import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    api
      .get("/cart")
      .then((d) => {
        if (mounted) setItems(d.items || []);
      })
      .catch((e) => {
        console.error(e);
        alert("Failed to load cart");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, [user]);

  async function removeItem(itemId) {
    try {
      await api.post("/cart/remove", { item_id: itemId });
      setItems(items.filter((i) => i.id !== itemId));
    } catch (err) {
      alert(err.data?.error || err.message);
    }
  }

  async function checkout() {
    if (!user) return alert("Please login first");
    const address = prompt("Enter shipping address:");
    if (!address) return;
    try {
      const data = await api.post("/orders/create", {
        shipping_address: address,
      });
      alert("Order placed! ID: " + data.orderId);
      setItems([]);
    } catch (err) {
      alert(err.data?.error || err.message);
    }
  }

  const total = items.reduce((s, it) => s + Number(it.price) * it.qty, 0);

  if (loading) return <div>Loading cart...</div>;
  if (!user)
    return <div style={{ padding: 20 }}>Please login to see your cart.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "12px auto" }}>
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <div>Cart is empty</div>
      ) : (
        <div>
          {items.map((it) => (
            <div
              key={it.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 8,
                borderBottom: "1px solid #eee",
              }}
            >
              <div>
                <div>
                  <strong>{it.product_title}</strong>
                </div>
                <div>
                  {it.variant_name} × {it.qty}
                </div>
              </div>
              <div>
                <div>Rs {Number(it.price) * it.qty}</div>
                <div style={{ marginTop: 6 }}>
                  <button
                    onClick={() => removeItem(it.id)}
                    style={{
                      backgroundColor: "#e63946",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <strong>Total: Rs {total.toFixed(2)}</strong>
            <div style={{ marginTop: 8 }}>
              <button onClick={checkout}>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
