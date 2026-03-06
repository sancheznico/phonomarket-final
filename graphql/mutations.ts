import { gql } from "@apollo/client";

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
  mutation UpdatePhone($id: ID!, $price: Float, $storageGb: Int) {
    updatePhone(id: $id, price: $price, storageGb: $storageGb) {
      id
      brand
      model
      price
      storage_gb
    }
  }
`;

export const DELETE_PHONE = gql`
  mutation DeletePhone($id: ID!) {
    deletePhone(id: $id)
  }
`;