"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RETAILERS } from "../../graphql/queries";
import { ADD_RETAILER, UPDATE_RETAILER, DELETE_RETAILER } from "../../graphql/mutations";

export default function RetailersPage() {
  // Queries
  const { data, loading, error, refetch } = useQuery(GET_RETAILERS);

  // Mutations
  const [addRetailer] = useMutation(ADD_RETAILER);
  const [updateRetailer] = useMutation(UPDATE_RETAILER);
  const [deleteRetailer] = useMutation(DELETE_RETAILER);

  // States
  const [newRetailer, setNewRetailer] = useState({ name: "", location: "" });
  const [editRetailer, setEditRetailer] = useState<any | null>(null);
  const [viewRetailer, setViewRetailer] = useState<any | null>(null);

  // Add retailer
  const handleAdd = async () => {
    try {
      await addRetailer({ variables: { input: newRetailer } });
      setNewRetailer({ name: "", location: "" });
      refetch();
    } catch (err: any) {
      console.error(err.message);
      alert("Failed to add retailer. Check console for details.");
    }
  };

  // Update retailer
  const handleUpdate = async () => {
    if (!editRetailer) return;
    try {
      await updateRetailer({
        variables: {
          id: editRetailer.id,
          input: {
            name: editRetailer.name,
            location: editRetailer.location,
          },
        },
      });
      setEditRetailer(null);
      refetch();
    } catch (err: any) {
      console.error(err.message);
      alert("Failed to update retailer. Check console for details.");
    }
  };

  // Delete retailer
  const handleDelete = async (id: string) => {
    try {
      await deleteRetailer({ variables: { id } });
      refetch();
    } catch (err: any) {
      console.error(err.message);
      alert("Failed to delete retailer. Check console for details.");
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Loading retailers...</p>;
  if (error) return <p style={{ padding: 30 }}>Error loading retailers</p>;

  return (
    <div style={{ minHeight: "100vh", padding: 30, fontFamily: "Arial", background: "#f5f5f5" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 30, color: "#007aff" }}>Retailers Manager</h1>

        {/* ===== ADD RETAILER ===== */}
        <div style={{ background: "#fff", padding: 25, borderRadius: 16, marginBottom: 40, boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginBottom: 20 }}>Add New Retailer</h2>
          <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
            <input
              placeholder="Name"
              value={newRetailer.name}
              onChange={(e) => setNewRetailer({ ...newRetailer, name: e.target.value })}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", flex: 1 }}
            />
            <input
              placeholder="Location"
              value={newRetailer.location}
              onChange={(e) => setNewRetailer({ ...newRetailer, location: e.target.value })}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", flex: 1 }}
            />
            <button
              onClick={handleAdd}
              style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#007aff", color: "#fff", cursor: "pointer" }}
            >
              Add Retailer
            </button>
          </div>
        </div>

        {/* ===== RETAILERS TABLE ===== */}
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 10, overflow: "hidden" }}>
          <thead style={{ background: "#007aff", color: "#fff" }}>
            <tr>
              <th style={{ border: "1px solid #007aff", padding: 10 }}>Name</th>
              <th style={{ border: "1px solid #007aff", padding: 10 }}>Location</th>
              <th style={{ border: "1px solid #007aff", padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.retailers.map((retailer: any) => (
              <tr key={retailer.id}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{retailer.name}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{retailer.location}</td>
                <td style={{ border: "1px solid #ccc", padding: 8, display: "flex", gap: 5 }}>
                  <button
                    onClick={() => setViewRetailer(retailer)}
                    style={{ flex: 1, padding: 6, borderRadius: 6, border: "none", background: "#28a745", color: "#fff", cursor: "pointer" }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => setEditRetailer(retailer)}
                    style={{ flex: 1, padding: 6, borderRadius: 6, border: "none", background: "#007aff", color: "#fff", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(retailer.id)}
                    style={{ flex: 1, padding: 6, borderRadius: 6, border: "none", background: "#ff3b30", color: "#fff", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===== VIEW MODAL ===== */}
        {viewRetailer && (
          <div
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", padding: 20, zIndex: 1000 }}
            onClick={() => setViewRetailer(null)}
          >
            <div
              style={{ background: "#fff", padding: 30, borderRadius: 16, width: "90%", maxWidth: 500 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: 20, color: "#28a745" }}>View Retailer</h2>
              <p><strong>Name:</strong> {viewRetailer.name}</p>
              <p><strong>Location:</strong> {viewRetailer.location}</p>
              <button
                onClick={() => setViewRetailer(null)}
                style={{ marginTop: 20, padding: 12, borderRadius: 10, border: "none", background: "#aaa", color: "#fff", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ===== EDIT MODAL ===== */}
        {editRetailer && (
          <div
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", padding: 20, zIndex: 1000 }}
            onClick={() => setEditRetailer(null)}
          >
            <div
              style={{ background: "#fff", padding: 30, borderRadius: 16, width: "90%", maxWidth: 500 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: 20, color: "#007aff" }}>Edit Retailer</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                <input
                  placeholder="Name"
                  value={editRetailer.name}
                  onChange={(e) => setEditRetailer({ ...editRetailer, name: e.target.value })}
                  style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
                />
                <input
                  placeholder="Location"
                  value={editRetailer.location}
                  onChange={(e) => setEditRetailer({ ...editRetailer, location: e.target.value })}
                  style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
                />
                <div style={{ display: "flex", gap: 15 }}>
                  <button
                    onClick={handleUpdate}
                    style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#007aff", color: "#fff", cursor: "pointer" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditRetailer(null)}
                    style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#aaa", color: "#fff", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}