const newsType = `
_id: ID!
title: [Language!]
text: [Language!]
images: [PrimaryImage!]
video: String!
author: Author!
date: String!`;

const newsInputType = `
title: [LanguageInput!]
text: [LanguageInput!]
images: [PrimaryImageInput!]
video: String!
author: AuthorInput!
date: String!`;

module.exports = { newsType, newsInputType };
