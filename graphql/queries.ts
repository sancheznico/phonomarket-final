import { gql } from "@apollo/client";

export const SEARCH_PHONES = gql`
  query SearchPhones($input: SearchPhoneInput) {
    searchPhones(input: $input) {
      id
      brand
      model
      price
      storage_gb
      ram_gb
      image_url
      retailer_id
      category_id
      description
    }
  }
`;

export const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;

export const GET_RETAILERS = gql`
  query {
    retailers {
      id
      name
    }
  }
`;

export const GET_PHONES = gql`
  query {
    phones {
      id
      brand
      model
      price
      storage_gb
      ram_gb
      image_url
      description
      retailer_id
      category_id
    }
  }
`;

export const GET_PHONE = gql`
  query GetPhone($id: ID!) {
    phone(id: $id) {
      id
      brand
      model
      price
      storage_gb
      ram_gb
      image_url
      description
      retailer_id
      category_id
    }
  }
`;