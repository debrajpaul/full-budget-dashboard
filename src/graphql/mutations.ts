import { gql } from '@apollo/client';


export const RECLASSIFY = gql`
mutation Reclassify($tenantId: ID!, $id: ID!, $category: String!) {
reclassifyTransaction(tenantId: $tenantId, id: $id, category: $category) {
id
category
taggedBy
}
}
`;

export const LOGIN = gql`
  mutation Login($value: LoginInput!) {
    login(input: $value) {
      token
      user {
        email
        name
        tenantId
        isActive
      }
    }
  }
`;