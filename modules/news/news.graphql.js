const newsType = `
type News {
_id: ID!
title: [Language]
text: [Language]
image: String
author: Author
date: String
show: Boolean
languages: [String]
}`;

const newsInput = `
input NewsInput {
title: [LanguageInput]
text: [LanguageInput]
image: String
author: AuthorInput
date: String
show: Boolean
languages: [String]
}`;

module.exports = { newsType, newsInput };
