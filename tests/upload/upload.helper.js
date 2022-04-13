const { gql } = require('@apollo/client');

const uploadFiles = async (file, operations) => {
  const uploadedFiles = await operations.mutate({
    mutation: gql`
      mutation ($files: [Upload]!) {
        uploadFiles(files: $files) {
          ... on File {
            prefixUrl
            fileNames {
              large
              medium
              small
              thumbnail
            }
          }
        }
      }
    `,
    variables: {
      files: [file],
    },
  });

  return uploadedFiles.data.uploadFiles;
};
const deleteFiles = async (fileNames, operations) => {
  const deletedFiles = await operations.mutate({
    mutation: gql`
      mutation ($fileNames: [String]) {
        deleteFiles(fileNames: $fileNames)
      }
    `,
    variables: {
      fileNames,
    },
  });

  return deletedFiles.data.deleteFiles;
};

module.exports = {
  uploadFiles,
  deleteFiles,
};
