import { db } from "../lib/db";
import { RowDataPacket, OkPacket } from "mysql2";

interface SearchPhoneInput {
  searchTerm?: string;
  categoryId?: string;
  maxPrice?: number;
  minStorage?: number;
  retailerId?: string;
}

interface AddPhoneInput {
  brand: string;
  model: string;
  price: number;
  storageGb: number;
  ramGb?: number;
  retailerId: string;
  categoryId: string;
  imageUrl?: string;
  description?: string;
}

export const resolvers = {
  Query: {
    phones: async () => {
      const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM phones");
      return rows;
    },

    searchPhones: async (_: any, { input }: { input: SearchPhoneInput }) => {
      const { searchTerm, categoryId, maxPrice, minStorage, retailerId } = input || {};
      let query = "SELECT * FROM phones WHERE 1=1";
      const params: any[] = [];

      if (searchTerm) {
        query += " AND (brand LIKE ? OR model LIKE ?)";
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
      }
      if (categoryId) {
        query += " AND category_id = ?";
        params.push(categoryId);
      }
      if (retailerId) {
        query += " AND retailer_id = ?";
        params.push(retailerId);
      }
      if (maxPrice !== undefined) {
        query += " AND price <= ?";
        params.push(maxPrice);
      }
      if (minStorage !== undefined) {
        query += " AND storage_gb >= ?";
        params.push(minStorage);
      }

      const [rows] = await db.query<RowDataPacket[]>(query, params);
      return rows;
    },

    retailers: async () => {
      const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM retailers");
      return rows;
    },

    categories: async () => {
      const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM categories");
      return rows;
    },

    phone: async (_: any, { id }: { id: string }) => {
      const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM phones WHERE id = ?", [id]);
      return rows[0];
    },
  },

  Mutation: {
    addPhone: async (_: any, { input }: { input: AddPhoneInput }) => {
      const { brand, model, price, storageGb, ramGb, retailerId, categoryId, imageUrl, description } = input;
      const [result] = await db.query<OkPacket>(
        `INSERT INTO phones
          (brand, model, price, storage_gb, ram_gb, retailer_id, category_id, image_url, description)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [brand, model, price, storageGb, ramGb, retailerId, categoryId, imageUrl, description]
      );
      const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM phones WHERE id = ?", [result.insertId]);
      return rows[0];
    },

    updatePhone: async (_: any, { id, input }: { id: string; input: any }) => {
      if (!input) throw new Error("No input provided");

      const {
        brand,
        model,
        price,
        storageGb,
        ramGb,
        retailerId,
        categoryId,
        imageUrl,
        description,
      } = input;

      await db.query(
        `UPDATE phones SET 
          brand = COALESCE(?, brand),
          model = COALESCE(?, model),
          price = COALESCE(?, price),
          storage_gb = COALESCE(?, storage_gb),
          ram_gb = COALESCE(?, ram_gb),
          retailer_id = COALESCE(?, retailer_id),
          category_id = COALESCE(?, category_id),
          image_url = COALESCE(?, image_url),
          description = COALESCE(?, description)
        WHERE id = ?`,
        [brand, model, price, storageGb, ramGb, retailerId, categoryId, imageUrl, description, id]
      );

      const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM phones WHERE id = ?", [id]);
      return rows[0];
    },

    deletePhone: async (_: any, { id }: { id: string }) => {
      await db.query("DELETE FROM phones WHERE id = ?", [id]);
      return true;
    },
  },
};