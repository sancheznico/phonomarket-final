"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { SEARCH_PHONES, GET_CATEGORIES, GET_RETAILERS } from "../graphql/queries";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [storageFilter, setStorageFilter] = useState<number | undefined>();
  const [priceFilter, setPriceFilter] = useState<number | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [retailerFilter, setRetailerFilter] = useState<string>("");
  const [selectedPhone, setSelectedPhone] = useState<any | null>(null);
  const [filteredPhones, setFilteredPhones] = useState<any[]>([]);

  const { data: catData } = useQuery(GET_CATEGORIES);
  const { data: retailData } = useQuery(GET_RETAILERS);
  const { loading, error, data } = useQuery(SEARCH_PHONES, { variables: { input: {} } });

  if (loading) return <p style={{ padding: 30 }}>Loading phones...</p>;
  if (error) return <p style={{ padding: 30 }}>Error loading phones</p>;

  const handleFilter = () => {
    if (!data?.searchPhones) return;

    const result = data.searchPhones.filter((phone: any) => {
      const matchesSearch = !searchTerm || 
        `${phone.brand} ${phone.model}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStorage = !storageFilter || Number(phone.storage_gb) === Number(storageFilter);
      const matchesPrice = !priceFilter || phone.price <= Number(priceFilter);
      const matchesCategory = !categoryFilter || phone.category_id === categoryFilter;
      const matchesRetailer = !retailerFilter || phone.retailer_id === retailerFilter;

      return matchesSearch && matchesStorage && matchesPrice && matchesCategory && matchesRetailer;
    });

    setFilteredPhones(result);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (!data?.searchPhones) return;

    const result = data.searchPhones.filter((phone: any) =>
      `${phone.brand} ${phone.model}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPhones(result);
  };

  const getCategoryName = (id: string) =>
    catData?.categories.find((c: any) => c.id === id)?.name || "Unknown";

  const getRetailerName = (id: string) =>
    retailData?.retailers.find((r: any) => r.id === id)?.name || "Unknown";

  const phonesToDisplay =
    filteredPhones.length > 0 || searchTerm || storageFilter || priceFilter || categoryFilter || retailerFilter
      ? filteredPhones
      : data.searchPhones;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #ffffff, #eaf6ff)", fontFamily: "Arial" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 25 }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: "#007aff" }}>PhonoMarket</h1>
          <button
            style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#007aff", color: "#fff", cursor: "pointer" }}
            onClick={() => (window.location.href = "/admin")}
          >
            Admin Panel
          </button>
        </div>

        {/* FILTERS */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 30 }}>
          <input
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", minWidth: 150 }}
            placeholder="Search brand/model"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <input
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", minWidth: 150 }}
            type="number"
            placeholder="Exact Storage (GB)"
            value={storageFilter || ""}
            onChange={(e) => setStorageFilter(e.target.value ? Number(e.target.value) : undefined)}
          />
          <input
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", minWidth: 150 }}
            type="number"
            placeholder="Max Price ($)"
            value={priceFilter || ""}
            onChange={(e) => setPriceFilter(e.target.value ? Number(e.target.value) : undefined)}
          />
          <select
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", minWidth: 150 }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {catData?.categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", minWidth: 150 }}
            value={retailerFilter}
            onChange={(e) => setRetailerFilter(e.target.value)}
          >
            <option value="">All Retailers</option>
            {retailData?.retailers.map((r: any) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button
            style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#007aff", color: "#fff", cursor: "pointer" }}
            onClick={handleFilter}
          >
            Filter
          </button>
        </div>

        {/* PHONE GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {phonesToDisplay.map((phone: any) => (
            <div
              key={phone.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 15,
                boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 150, marginBottom: 10 }}>
                <img
                  src={phone.image_url || "/placeholder.png"}
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: 10 }}
                />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "5px 0" }}>
                  {phone.brand} {phone.model}
                </h3>
                <p style={{ fontWeight: 700, color: "#007aff" }}>${phone.price}</p>
                <p style={{ fontSize: 14, color: "#555" }}>
                  {phone.storage_gb}GB Storage • {phone.ram_gb}GB RAM
                </p>
              </div>
              <button
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "#007aff",
                  color: "#fff",
                  cursor: "pointer",
                  marginTop: 12,
                }}
                onClick={() => setSelectedPhone(phone)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {selectedPhone && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              zIndex: 999,
            }}
            onClick={() => setSelectedPhone(null)}
          >
            <div
              style={{
                background: "#fff",
                padding: 30,
                borderRadius: 16,
                maxWidth: 700,
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2>
                  {selectedPhone.brand} {selectedPhone.model}
                </h2>
                <button
                  style={{
                    border: "none",
                    background: "#eee",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() => setSelectedPhone(null)}
                >
                  ✕
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <img
                  src={selectedPhone.image_url || "/placeholder.png"}
                  style={{ width: "100%", maxHeight: 300, objectFit: "contain", borderRadius: 12 }}
                />
                <div style={{ fontSize: 22, fontWeight: 700, color: "#007aff" }}>${selectedPhone.price}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 15 }}>
                  <div>
                    <b>Storage:</b> {selectedPhone.storage_gb}GB
                  </div>
                  <div>
                    <b>RAM:</b> {selectedPhone.ram_gb}GB
                  </div>
                  <div>
                    <b>Retailer:</b> {getRetailerName(selectedPhone.retailer_id)}
                  </div>
                  <div>
                    <b>Category:</b> {getCategoryName(selectedPhone.category_id)}
                  </div>
                </div>
                <div style={{ lineHeight: 1.6, color: "#444" }}>{selectedPhone.description}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}