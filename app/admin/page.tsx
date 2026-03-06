"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PHONES, GET_CATEGORIES, GET_RETAILERS } from "../../graphql/queries";
import { ADD_PHONE, UPDATE_PHONE, DELETE_PHONE } from "../../graphql/mutations";

export default function AdminPanel() {
  const { data, loading, error, refetch } = useQuery(GET_PHONES);
  const { data: catData } = useQuery(GET_CATEGORIES);
  const { data: retailData } = useQuery(GET_RETAILERS);

  const [addPhone] = useMutation(ADD_PHONE);
  const [updatePhone] = useMutation(UPDATE_PHONE);
  const [deletePhone] = useMutation(DELETE_PHONE);

  const [search, setSearch] = useState("");
  const [editPhone, setEditPhone] = useState<any | null>(null);
  const [viewPhone, setViewPhone] = useState<any | null>(null);
  const [newPhone, setNewPhone] = useState<any>({
    brand: "",
    model: "",
    price: undefined,
    storageGb: undefined,
    ramGb: undefined,
    imageUrl: "",
    retailerId: "",
    categoryId: "",
    description: "",
  });

  const normalizePhone = (phone: any) => ({
    id: phone.id,
    brand: phone.brand,
    model: phone.model,
    price: phone.price,
    storageGb: phone.storage_gb,
    ramGb: phone.ram_gb,
    retailerId: phone.retailer_id,
    categoryId: phone.category_id,
    imageUrl: phone.image_url,
    description: phone.description,
  });

  const handleAdd = async () => {
    try {
      await addPhone({ variables: { input: newPhone } });
      setNewPhone({
        brand: "",
        model: "",
        price: undefined,
        storageGb: undefined,
        ramGb: undefined,
        imageUrl: "",
        retailerId: "",
        categoryId: "",
        description: "",
      });
      refetch();
    } catch (err: any) {
      console.error(err.message);
      alert("Failed to add phone. Check console for details.");
    }
  };

  const handleUpdate = async () => {
    if (!editPhone) return;
    try {
      await updatePhone({
        variables: {
          id: editPhone.id,
          input: {
            brand: editPhone.brand || "",
            model: editPhone.model || "",
            price: Number(editPhone.price) || 0,
            storageGb: Number(editPhone.storageGb) || 0,
            ramGb: Number(editPhone.ramGb) || 0,
            retailerId: editPhone.retailerId || "",
            categoryId: editPhone.categoryId || "",
            imageUrl: editPhone.imageUrl || "",
            description: editPhone.description || "",
          },
        },
      });
      setEditPhone(null);
      refetch();
    } catch (err: any) {
      console.error(err.message);
      alert("Failed to update phone. Check console for details.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePhone({ variables: { id } });
      refetch();
    } catch (err: any) {
      console.error(err.message);
      alert("Failed to delete phone. Check console for details.");
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Loading phones...</p>;
  if (error) return <p style={{ padding: 30 }}>Error loading phones</p>;

  const filteredPhones = data.phones.filter((p: any) =>
    `${p.brand} ${p.model}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f2f6fc", padding: 20, fontFamily: "Arial" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <button
          onClick={() => (window.location.href = "/")}
          style={{ marginBottom: 20, padding: "10px 18px", borderRadius: 10, border: "none", background: "#007aff", color: "#fff", cursor: "pointer" }}
        >
          ← Back
        </button>

        <h1 style={{ marginBottom: 30, color: "#007aff" }}>Admin Inventory Manager</h1>

        {/* ADD PHONE CARD */}
        <div style={{ background: "#fff", padding: 25, borderRadius: 16, marginBottom: 40, boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginBottom: 20 }}>Add New Phone</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 15 }}>
            <input placeholder="Brand" value={newPhone.brand} onChange={(e) => setNewPhone({ ...newPhone, brand: e.target.value })} style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
            <input placeholder="Model" value={newPhone.model} onChange={(e) => setNewPhone({ ...newPhone, model: e.target.value })} style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
            <input type="number" placeholder="Price ($)" value={newPhone.price || ""} onChange={(e) => setNewPhone({ ...newPhone, price: Number(e.target.value) })} style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
            <input type="number" placeholder="Storage (GB)" value={newPhone.storageGb || ""} onChange={(e) => setNewPhone({ ...newPhone, storageGb: Number(e.target.value) })} style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
            <input type="number" placeholder="RAM (GB)" value={newPhone.ramGb || ""} onChange={(e) => setNewPhone({ ...newPhone, ramGb: Number(e.target.value) })} style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
            <input placeholder="Image URL" value={newPhone.imageUrl} onChange={(e) => setNewPhone({ ...newPhone, imageUrl: e.target.value })} style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />

            <select value={newPhone.retailerId} onChange={(e) => setNewPhone({ ...newPhone, retailerId: e.target.value })} style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}>
              <option value="">Select Retailer</option>
              {retailData?.retailers.map((r: any) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <select value={newPhone.categoryId} onChange={(e) => setNewPhone({ ...newPhone, categoryId: e.target.value })} style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}>
              <option value="">Select Category</option>
              {catData?.categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <textarea placeholder="Description" value={newPhone.description} onChange={(e) => setNewPhone({ ...newPhone, description: e.target.value })} style={{ width: "100%", marginTop: 15, padding: 10, borderRadius: 8, border: "1px solid #ccc", minHeight: 60 }} />

          {newPhone.imageUrl && <img src={newPhone.imageUrl} style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 10, marginTop: 10 }} />}
          <button onClick={handleAdd} style={{ marginTop: 15, padding: "10px 18px", borderRadius: 10, border: "none", background: "#007aff", color: "#fff", cursor: "pointer" }}>Add Phone</button>
        </div>

        {/* SEARCH */}
        <input placeholder="Search phone..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: 10, marginBottom: 20, width: "100%", maxWidth: 300, borderRadius: 10, border: "1px solid #ccc" }} />

        {/* TABLE */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
            <thead style={{ background: "#007aff", color: "#fff" }}>
              <tr>
                <th style={{ border: "1px solid #007aff", padding: 10 }}>Image</th>
                <th style={{ border: "1px solid #007aff", padding: 10 }}>Brand</th>
                <th style={{ border: "1px solid #007aff", padding: 10 }}>Model</th>
                <th style={{ border: "1px solid #007aff", padding: 10 }}>Price</th>
                <th style={{ border: "1px solid #007aff", padding: 10 }}>Storage</th>
                <th style={{ border: "1px solid #007aff", padding: 10 }}>RAM</th>
                <th style={{ border: "1px solid #007aff", padding: 10 }}>Retailer</th>
                <th style={{ border: "1px solid #007aff", padding: 10 }}>Category</th>
                <th style={{ border: "1px solid #007aff", padding: 10 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPhones.map((phone: any) => (
                <tr key={phone.id}>
                  <td style={{ border: "1px solid #ccc", textAlign: "center", padding: 8 }}>
                    {phone.image_url && <img src={phone.image_url} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }} />}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>{phone.brand}</td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>{phone.model}</td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>${phone.price}</td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>{phone.storage_gb}GB</td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>{phone.ram_gb}GB</td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>{retailData?.retailers.find((r: any) => r.id === phone.retailer_id)?.name}</td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>{catData?.categories.find((c: any) => c.id === phone.category_id)?.name}</td>
                  <td style={{ border: "1px solid #ccc", padding: 8, display: "flex", gap: 5, flexWrap: "wrap" }}>
                    <button onClick={() => setViewPhone(phone)} style={{ flex: 1, padding: 6, borderRadius: 6, border: "none", background: "#28a745", color: "#fff", cursor: "pointer" }}>View</button>
                    <button onClick={() => setEditPhone(normalizePhone(phone))} style={{ flex: 1, padding: 6, borderRadius: 6, border: "none", background: "#007aff", color: "#fff", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(phone.id)} style={{ flex: 1, padding: 6, borderRadius: 6, border: "none", background: "#ff3b30", color: "#fff", cursor: "pointer" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VIEW & EDIT MODALS */}
        {viewPhone && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", padding: 20, zIndex: 1000 }} onClick={() => setViewPhone(null)}>
            <div style={{ background: "#fff", padding: 30, borderRadius: 16, width: "90%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginBottom: 20, color: "#28a745" }}>View Phone Details</h2>
              {viewPhone.image_url && <img src={viewPhone.image_url} style={{ width: "100%", maxHeight: 250, objectFit: "contain", borderRadius: 10, marginBottom: 15 }} />}
              <p><strong>Brand:</strong> {viewPhone.brand}</p>
              <p><strong>Model:</strong> {viewPhone.model}</p>
              <p><strong>Price:</strong> ${viewPhone.price}</p>
              <p><strong>Storage:</strong> {viewPhone.storage_gb}GB</p>
              <p><strong>RAM:</strong> {viewPhone.ram_gb}GB</p>
              <p><strong>Retailer:</strong> {retailData?.retailers.find((r: any) => r.id === viewPhone.retailer_id)?.name}</p>
              <p><strong>Category:</strong> {catData?.categories.find((c: any) => c.id === viewPhone.category_id)?.name}</p>
              <p><strong>Description:</strong> {viewPhone.description}</p>
              <button onClick={() => setViewPhone(null)} style={{ marginTop: 20, padding: 12, borderRadius: 10, border: "none", background: "#aaa", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Close</button>
            </div>
          </div>
        )}

        {editPhone && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", padding: 20, zIndex: 1000 }} onClick={() => setEditPhone(null)}>
            <div style={{ background: "#fff", padding: 30, borderRadius: 16, width: "90%", maxWidth: 700, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginBottom: 20, color: "#007aff" }}>Edit Phone</h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 15 }}>
                <input placeholder="Brand" value={editPhone.brand} onChange={e => setEditPhone({ ...editPhone, brand: e.target.value })} style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }} />
                <input placeholder="Model" value={editPhone.model} onChange={e => setEditPhone({ ...editPhone, model: e.target.value })} style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }} />
                <input type="number" placeholder="Price ($)" value={editPhone.price || ""} onChange={e => setEditPhone({ ...editPhone, price: Number(e.target.value) })} style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }} />
                <input type="number" placeholder="Storage (GB)" value={editPhone.storageGb || ""} onChange={e => setEditPhone({ ...editPhone, storageGb: Number(e.target.value) })} style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }} />
                <input type="number" placeholder="RAM (GB)" value={editPhone.ramGb || ""} onChange={e => setEditPhone({ ...editPhone, ramGb: Number(e.target.value) })} style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }} />
                <input placeholder="Image URL" value={editPhone.imageUrl} onChange={e => setEditPhone({ ...editPhone, imageUrl: e.target.value })} style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }} />
              </div>

              {editPhone.imageUrl && <img src={editPhone.imageUrl} style={{ width: "100%", maxHeight: 250, objectFit: "contain", borderRadius: 12, marginTop: 15 }} />}
              <textarea placeholder="Description" value={editPhone.description} onChange={e => setEditPhone({ ...editPhone, description: e.target.value })} style={{ width: "100%", marginTop: 15, padding: 12, borderRadius: 8, border: "1px solid #ccc", minHeight: 80 }} />

              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                <button onClick={handleUpdate} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#007aff", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Save</button>
                <button onClick={() => setEditPhone(null)} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#aaa", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}