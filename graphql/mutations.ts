import { gql } from "@apollo/client";

// Phone mutations (you already have these)
export const ADD_PHONE = gql`
  mutation AddPhone($input: AddPhoneInput!) {
    addPhone(input: $input) {
      id
      brand
      model
      price
      storage_gb
      ram_gb
      retailer_id
      category_id
      image_url
      description
    }
  }
`;

export const UPDATE_PHONE = gql`
  mutation UpdatePhone($id: ID!, $input: UpdatePhoneInput!) {
    updatePhone(id: $id, input: $input) {
      id
      brand
      model
      price
      storage_gb
      ram_gb
      retailer_id
      category_id
      image_url
      description
    }
  }
`;

export const DELETE_PHONE = gql`
  mutation DeletePhone($id: ID!) {
    deletePhone(id: $id)
  }
`;

// ================= RETAILER MUTATIONS =================
export const ADD_RETAILER = gql`
  mutation AddRetailer($input: AddRetailerInput!) {
    addRetailer(input: $input) {
      id
      name
      website
    }
  }
`;

export const UPDATE_RETAILER = gql`
  mutation UpdateRetailer($id: ID!, $input: UpdateRetailerInput!) {
    updateRetailer(id: $id, input: $input) {
      id
      name
      website
    }
  }
`;

export const DELETE_RETAILER = gql`
  mutation DeleteRetailer($id: ID!) {
    deleteRetailer(id: $id)
  }
`;