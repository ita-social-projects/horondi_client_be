const newsMutation = `
addNews(
    title: [LanguageInput!]
    text: [LanguageInput!]
    images: [PrimaryImageInput!]
    video: String!
    author: AuthorInput!
    date: String!):News`;
module.exports = { newsMutation };
