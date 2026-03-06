"use client";

import { useQuery } from "@apollo/client";
import { GET_PHONE } from "../../../graphql/queries";
import Link from "next/link";

interface PhoneProps {
  params: { id: string };
}

export default function PhoneDetail({ params }: PhoneProps) {
  const { id } = params;

  const { loading, error, data } = useQuery(GET_PHONE, {
    variables: { id },
  });

  if (loading) return <p>Loading phone...</p>;
  if (error) return <p>Error loading phone</p>;

  const phone = data.phone;

  return (
    <div style={{ padding: 20 }}>
      <Link href="/" style={{ marginBottom: 20, display: "inline-block" }}>
        ← Back to Gallery
      </Link>

      <h1>{phone.brand} {phone.model}</h1>

      {phone.image_url && (
        <img
          src={phone.image_url}
          alt={phone.model}
          style={{ width: 300, height: "auto", margin: "20px 0" }}
        />
      )}

      <p><strong>Price:</strong> ${phone.price}</p>
      <p><strong>Storage:</strong> {phone.storage_gb} GB</p>
      <p><strong>RAM:</strong> {phone.ram_gb} GB</p>
      {phone.color && <p><strong>Color:</strong> {phone.color}</p>}
      {phone.description && <p><strong>Description:</strong> {phone.description}</p>}

      <p><strong>Retailer ID:</strong> {phone.retailer_id}</p>
      <p><strong>Category ID:</strong> {phone.category_id}</p>
    </div>
  );
}