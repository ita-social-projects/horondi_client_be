const { gql } = require('@apollo/client');

const createNews = async (news, operations) => {
  const res = await operations
    .mutate({
      mutation: gql`
        mutation($news: NewsInput!) {
          addNews(news: $news, upload: []) {
            ... on News {
              _id
              title {
                lang
                value
              }
              text {
                lang
                value
              }
              author {
                name {
                  value
                }
              }
            }
            ... on Error {
              message
              statusCode
            }
          }
        }
      `,
      variables: {
        news,
      },
    })
    .catch((e) => e);

  return res.data.addNews;
};
const updateNews = async (id, news, operations) => {
  const res = await operations
    .mutate({
      mutation: gql`
        mutation($id: ID!, $news: NewsInput!) {
          updateNews(id: $id, news: $news, upload: []) {
            ... on News {
              _id
              title {
                lang
                value
              }
              text {
                lang
                value
              }
              author {
                name {
                  lang
                  value
                }
                image
              }
              image
            }
            ... on Error {
              message
              statusCode
            }
          }
        }
      `,
      variables: {
        id,
        news,
      },
    })
    .catch((e) => e);

  return res.data.updateNews;
};
const deleteNews = async (id, operations) => {
  const res = await operations
    .mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteNews(id: $id) {
            ... on News {
              text {
                lang
                value
              }
              author {
                name {
                  lang
                  value
                }
              }
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id },
    })
    .catch((e) => e);

  return res.data.deleteNews;
};
const getAllNews = async (skip, limit, filter, operations) => {
  const res = await operations
    .query({
      query: gql`
        query($skip: Int, $limit: Int, $filter: NewsFilterInput) {
          getAllNews(skip: $skip, limit: $limit, filter: $filter) {
            items {
              _id
              author {
                name {
                  lang
                  value
                }
                image
              }
              title {
                lang
                value
              }
              text {
                lang
                value
              }
              date
            }
          }
        }
      `,
      variables: { skip, limit, filter },
    })
    .catch((e) => e);

  return res.data.getAllNews;
};
const getById = async (id, operations) => {
  const res = await operations
    .query({
      query: gql`
        query($id: ID!) {
          getNewsById(id: $id) {
            ... on News {
              title {
                lang
                value
              }
              text {
                lang
                value
              }
              author {
                name {
                  lang
                  value
                }
              }
              date
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id },
    })
    .catch((e) => e);

  return res.data.getNewsById;
};

module.exports = {
  createNews,
  updateNews,
  deleteNews,
  getAllNews,
  getById,
};
