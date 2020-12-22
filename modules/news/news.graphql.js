const newsType = `
type News {
_id: ID!
title: [Language]
text: [Language]
image: PrimaryImage
author: Author
date: String
show: Boolean
languages: [String]
}`;

const newsInput = `
input NewsInput {
title: [LanguageInput]
text: [LanguageInput]
image: PrimaryImageInput
author: AuthorInput
date: String
show: Boolean
languages: [String]
}`;

module.exports = { newsType, newsInput };
