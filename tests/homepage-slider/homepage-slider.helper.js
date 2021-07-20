const { gql } = require('@apollo/client');

const addHomePageSlide = async (slide, upload, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($slide: HomePageSlideInput!, $upload: Upload) {
        addSlide(slide: $slide, upload: $upload) {
          ... on HomePageSlide {
            _id
            title {
              lang
              value
            }
            description {
              lang
              value
            }
            link
            images {
              large
              medium
              small
              thumbnail
            }
            order
            show
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      slide,
      upload: upload ? '__tests__/homepage-images/img.png' : undefined,
    },
  });

  return res.data.addSlide;
};

const updateHomePageSlide = async (id, slide, upload, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $slide: HomePageSlideInput!, $upload: Upload) {
        updateSlide(id: $id, slide: $slide, upload: $upload) {
          ... on HomePageSlide {
            _id
            title {
              lang
              value
            }
            description {
              lang
              value
            }
            link
            images {
              large
              medium
              small
              thumbnail
            }
            order
            show
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      id,
      slide,
      upload: upload ? '__tests__/homepage-images/img.png' : undefined,
    },
  });

  return res.data.updateSlide;
};

const deleteHomePageSlide = async (id, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteSlide(id: $id) {
          ... on HomePageSlide {
            _id
            title {
              lang
              value
            }
            description {
              lang
              value
            }
            link
            images {
              large
              medium
              small
              thumbnail
            }
            order
            show
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });

  return res.data.deleteSlide;
};

const getAllHomePageSlides = async (limit, skip, operations) => {
  const res = await operations.query({
    query: gql`
      query($limit: Int, $skip: Int) {
        getAllSlides(limit: $limit, skip: $skip) {
          ... on PaginatedHomePageSlides {
            items {
              _id
              title {
                lang
                value
              }
              description {
                lang
                value
              }
              link
              images {
                large
                medium
                small
                thumbnail
              }
              order
              show
            }
            count
          }
        }
      }
    `,
    variables: {
      limit,
      skip,
    },
  });

  return res.data.getAllSlides;
};

const getSlideById = async (id, operations) => {
  const res = await operations.query({
    query: gql`
      query($id: ID!) {
        getSlideById(id: $id) {
          ... on HomePageSlide {
            _id
            title {
              lang
              value
            }
            description {
              lang
              value
            }
            link
            images {
              large
              medium
              small
              thumbnail
            }
            order
            show
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });

  return res.data.getSlideById;
};

module.exports = {
  addHomePageSlide,
  deleteHomePageSlide,
  getSlideById,
  getAllHomePageSlides,
  updateHomePageSlide,
};
