import { gql } from "@apollo/client";

export const GET_GENERAL_SETTINGS = gql`
  query GetGeneralSettings {
    generalSettings {
      title
      description
    }
  }
`;

export const GET_PAGES = gql`
  query GetPages {
    pages {
      nodes {
        id
        slug
        title
        content
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($id: ID!) {
    page(id: $id, idType: URI) {
      id
      title
      content
    }
  }
`;
