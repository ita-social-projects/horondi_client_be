const newsQuery = `
getAllNews: [News!]!
getNewsById(id: ID!): News
deleteNews(id: ID!): News
`;
module.exports = newsQuery;
