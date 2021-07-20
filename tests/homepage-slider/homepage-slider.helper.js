const { gql } = require('@apollo/client');

const addHomePageSlide = async (slide, operations) => {
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
      upload: '__tests__/homepage-images/img.png',
    },
  });

  return res.data.addSlide._id;
};

const updateHomePageSlide = async (id, slide, operations) => {
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
      upload: '__tests__/homepage-images/img.png',
    },
  });
  return res.data.updateSlide;
};

const deleteHomePageSlide = async (id, operations) =>
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteSlide(id: $id) {
          ... on HomePageSlide {
            _id
            title
            description
            link
            images {
              large
              medium
              small
              thumbnail
            }
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

const getAllHomePageSlides = async operations => {
  const res = await operations.query({
    query: gql`
      query {
        getAllSlides {
          _id
          title
          description
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
      }
    `,
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
