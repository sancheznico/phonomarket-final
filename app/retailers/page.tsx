"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { SEARCH_PHONES, GET_RETAILERS } from "../../graphql/queries";

export default function RetailersPage() {
  const [selectedRetailerId, setSelectedRetailerId] = useState<string | undefined>();
  const [selectedPhone, setSelectedPhone] = useState<any | null>(null);

  // Fetch retailers for dropdown
  const { data: retailData } = useQuery(GET_RETAILERS);

  // Fetch phones filtered by retailer
  const { loading, error, data, refetch } = useQuery(SEARCH_PHONES, {
    variables: { input: { retailerId: selectedRetailerId } },
  });

  const handleRetailerChange = (id: string) => {
    setSelectedRetailerId(id || undefined);
    refetch({ input: { retailerId: id || undefined } });
  };

  const getRetailerName = (id: string) =>
    retailData?.retailers.find((r: any) => r.id === id)?.name || "Unknown";

  if (loading) return <p style={{ color: "#ccc", textAlign: "center", marginTop: 50 }}>Loading phones...</p>;
  if (error) return <p style={{ color: "#e74c3c", textAlign: "center", marginTop: 50 }}>Error loading phones</p>;

  return (
    <div style={{ padding: 30, minHeight: "100vh", backgroundColor: "#121212", color: "#f5f5f7", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#af52de", marginBottom: 30, fontWeight: 600 }}>Retailer Hub</h1>

      {/* Retailer Selector */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 40,
          gap: 20,
        }}
      >
        <select
          value={selectedRetailerId || ""}
          onChange={(e) => handleRetailerChange(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #333",
            backgroundColor: "#2c2c2e",
            color: "#f5f5f7",
            outline: "none",
            minWidth: 250,
          }}
        >
          <option value="">Select a Retailer</option>
          {retailData?.retailers.map((r: any) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Retailer Banner */}
      {selectedRetailerId && (
        <div style={{
          textAlign: "center",
          marginBottom: 40,
          padding: 20,
          backgroundColor: "#1e1e1e",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}>
          <h2 style={{ color: "#af52de" }}>{getRetailerName(selectedRetailerId)}</h2>
        </div>
      )}

      {/* Phones Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 30 }}>
        {data.searchPhones.length === 0 && <p style={{ textAlign: "center" }}>No phones found for this retailer.</p>}
        {data.searchPhones.map((phone: any) => (
          <div
            key={phone.id}
            style={{
              backgroundColor: "#1f1f1f",
              borderRadius: 16,
              padding: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.6)";
            }}
          >
            <img
              src={phone.image_url || "/placeholder.png"}
              alt={phone.model}
              style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 12 }}
            />
            <h3 style={{ margin: "10px 0 5px 0", color: "#af52de" }}>
              {phone.brand} {phone.model}
            </h3>
            <p>${phone.price}</p>
            <p>Storage: {phone.storage_gb}GB | RAM: {phone.ram_gb}GB</p>
            <button
              onClick={() => setSelectedPhone(phone)}
              style={{
                marginTop: 10,
                padding: "8px 16px",
                borderRadius: 12,
                border: "none",
                backgroundColor: "#af52de",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPhone && (
        <div
          onClick={() => setSelectedPhone(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1f1f1f",
              padding: 25,
              borderRadius: 16,
              width: "90%",
              maxWidth: 480,
              position: "relative",
              boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
              animation: "scaleIn 0.3s",
            }}
          >
            <button
              onClick={() => setSelectedPhone(null)}
              style={{
                position: "absolute",
                top: 15,
                right: 20,
                fontSize: 26,
                fontWeight: "bold",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              ×
            </button>
            <h2 style={{ color: "#af52de" }}>{selectedPhone.brand} {selectedPhone.model}</h2>
            {selectedPhone.image_url && (
              <img
                src={selectedPhone.image_url}
                alt={selectedPhone.model}
                style={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: 12, margin: "15px 0" }}
              />
            )}
            <p><strong style={{ color: "#b292ff" }}>Price:</strong> ${selectedPhone.price}</p>
            <p><strong style={{ color: "#b292ff" }}>Storage:</strong> {selectedPhone.storage_gb} GB</p>
            <p><strong style={{ color: "#b292ff" }}>RAM:</strong> {selectedPhone.ram_gb} GB</p>
            {selectedPhone.color && <p><strong style={{ color: "#b292ff" }}>Color:</strong> {selectedPhone.color}</p>}
            {selectedPhone.description && <p><strong style={{ color: "#b292ff" }}>Description:</strong> {selectedPhone.description}</p>}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}