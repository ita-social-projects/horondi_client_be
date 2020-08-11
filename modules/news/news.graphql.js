const newsType = `
type News {
_id: ID!
title: [Language]
text: [Language]
images: PrimaryImage
author: Author
date: String
show: Boolean
}`;

const newsInput = `
input NewsInput {
title: [LanguageInput]
text: [LanguageInput]
images: PrimaryImageInput
author: AuthorInput
date: String
show: Boolean
}`;

module.exports = { newsType, newsInput };
