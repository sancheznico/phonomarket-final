"use client";

import React, { useState, CSSProperties } from "react";
import { useQuery } from "@apollo/client";
import { SEARCH_PHONES, GET_CATEGORIES, GET_RETAILERS } from "../graphql/queries";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [minStorage, setMinStorage] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [retailerId, setRetailerId] = useState<string | undefined>();
  const [selectedPhone, setSelectedPhone] = useState<any | null>(null);
  const [filteredPhones, setFilteredPhones] = useState<any[]>([]);

  const { data: catData } = useQuery(GET_CATEGORIES);
  const { data: retailData } = useQuery(GET_RETAILERS);
  const { loading, error, data } = useQuery(SEARCH_PHONES, {
    variables: { input: {} },
  });

  const getCategoryName = (id: string) =>
    catData?.categories.find((c: any) => c.id === id)?.name || "Unknown";

  const getRetailerName = (id: string) =>
    retailData?.retailers.find((r: any) => r.id === id)?.name || "Unknown";

  // -------- FILTER BUTTON LOGIC --------
  const handleFilter = () => {
    if (!data?.searchPhones) return;

    const result = data.searchPhones.filter((phone: any) => {
      const matchesSearch =
        !searchTerm ||
        `${phone.brand} ${phone.model}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStorage = !minStorage || phone.storage_gb >= minStorage;
      const matchesPrice = !maxPrice || phone.price <= maxPrice;
      const matchesCategory = !categoryId || phone.category_id === categoryId;
      const matchesRetailer = !retailerId || phone.retailer_id === retailerId;

      return (
        matchesSearch &&
        matchesStorage &&
        matchesPrice &&
        matchesCategory &&
        matchesRetailer
      );
    });

    setFilteredPhones(result);
  };

  // -------- LIVE SEARCH (optional) --------
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (!data?.searchPhones) return;

    const result = data.searchPhones.filter((phone: any) =>
      `${phone.brand} ${phone.model}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPhones(result);
  };

  if (loading) return <p style={{ padding: 30 }}>Loading phones...</p>;
  if (error) return <p style={{ padding: 30 }}>Error loading phones</p>;

  const phonesToDisplay =
    filteredPhones.length > 0 || searchTerm || minStorage || maxPrice || categoryId || retailerId
      ? filteredPhones
      : data.searchPhones;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #ffffff, #eaf6ff)", fontFamily: "Arial" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 25 }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: "#007aff" }}>PhonoMarket</h1>
          <button style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#007aff", color: "#fff", cursor: "pointer" }}
            onClick={() => (window.location.href = "/admin")}>Admin Panel</button>
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
            placeholder="Min Storage"
            onChange={(e) => setMinStorage(Number(e.target.value))}
          />
          <input
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", minWidth: 150 }}
            type="number"
            placeholder="Max Price"
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
          <select style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", minWidth: 150 }} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">All Categories</option>
            {catData?.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", minWidth: 150 }} onChange={(e) => setRetailerId(e.target.value)}>
            <option value="">All Retailers</option>
            {retailData?.retailers.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#007aff", color: "#fff", cursor: "pointer" }} onClick={handleFilter}>Filter</button>
        </div>

        {/* PHONE GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 20 }}>
          {phonesToDisplay.map((phone: any) => (
            <div key={phone.id} style={{ background: "#fff", borderRadius: 16, padding: 15, boxShadow: "0 5px 20px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <img src={phone.image_url || "/placeholder.png"} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 10, marginBottom: 10 }} />
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "5px 0" }}>{phone.brand} {phone.model}</h3>
                <p style={{ fontWeight: 700, color: "#007aff" }}>${phone.price}</p>
                <p style={{ fontSize: 14, color: "#555" }}>{phone.storage_gb}GB Storage • {phone.ram_gb}GB RAM</p>
              </div>
              <button style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#007aff", color: "#fff", cursor: "pointer", marginTop: 12 }} onClick={() => setSelectedPhone(phone)}>View Details</button>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {selectedPhone && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", padding: 20, zIndex: 999 }} onClick={() => setSelectedPhone(null)}>
            <div style={{ background: "#fff", padding: 30, borderRadius: 16, maxWidth: 700, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2>{selectedPhone.brand} {selectedPhone.model}</h2>
                <button style={{ border: "none", background: "#eee", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontWeight: "bold" }} onClick={() => setSelectedPhone(null)}>✕</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <img src={selectedPhone.image_url || "/placeholder.png"} style={{ width: "100%", maxHeight: 300, objectFit: "contain", borderRadius: 12 }} />
                <div style={{ fontSize: 22, fontWeight: 700, color: "#007aff" }}>${selectedPhone.price}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 15 }}>
                  <div><b>Storage:</b> {selectedPhone.storage_gb}GB</div>
                  <div><b>RAM:</b> {selectedPhone.ram_gb}GB</div>
                  <div><b>Retailer:</b> {getRetailerName(selectedPhone.retailer_id)}</div>
                  <div><b>Category:</b> {getCategoryName(selectedPhone.category_id)}</div>
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