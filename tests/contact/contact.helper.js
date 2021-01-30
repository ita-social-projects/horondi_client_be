const { gql } = require('@apollo/client');

const addContact = async (contact, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($contact: contactInput!) {
        addContact(contact: $contact, mapImages: []) {
          ... on Contact {
            _id
            phoneNumber
            openHours {
              lang
              value
            }
            address {
              lang
              value
            }
            email
            link
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { contact },
  });
  return res.data.addContact._id;
};
const deleteContact = async (id, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteContact(id: $id) {
          ... on Contact {
            _id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id },
  });
  return res.data.deleteContact;
};
const getContacts = async operations => {
  const res = await operations.query({
    query: gql`
      query($skip: Int, $limit: Int) {
        getContacts(skip: $skip, limit: $limit) {
          items {
            phoneNumber
            openHours {
              lang
              value
            }
            address {
              lang
              value
            }
            email
            link
          }
          count
        }
      }
    `,
    variables: {
      skip: 0,
      limit: 1,
    },
  });

  return res.data.getContacts;
};

module.exports = {
  addContact,
  deleteContact,
  getContacts,
};
