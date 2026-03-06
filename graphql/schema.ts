export const typeDefs = `#graphql
type Phone {
  id: ID!
  brand: String
  model: String
  price: Float
  storage_gb: Int
  ram_gb: Int
  image_url: String
  category_id: ID
  retailer_id: ID
  color: String
  description: String
}

type Retailer {
  id: ID!
  name: String
  location: String
  image_url: String
}

type Category {
  id: ID!
  name: String
}

input SearchPhoneInput {
  searchTerm: String
  categoryId: ID
  maxPrice: Float
  minStorage: Int
  retailerId: ID
}

input AddPhoneInput {
  brand: String!
  model: String!
  price: Float!
  storageGb: Int!
  ramGb: Int
  retailerId: ID!
  categoryId: ID!
  imageUrl: String
  description: String
}

type Query {
  phones: [Phone]
  searchPhones(input: SearchPhoneInput): [Phone]
  phone(id: ID!): Phone      
  retailers: [Retailer]
  categories: [Category]
}

type Mutation {
  addPhone(input: AddPhoneInput!): Phone
  updatePhone(id: ID!, price: Float, storageGb: Int): Phone
  deletePhone(id: ID!): Boolean
}
`;