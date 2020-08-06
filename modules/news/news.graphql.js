const newsType = `
type News {
_id: ID!
lang: String
title: String
text: String
images: PrimaryImage
author: Author
date: String
show: Boolean
}`;

const newsInput = `
input NewsInput {
lang: String
title: String
text: String
images: PrimaryImageInput
author: AuthorInput
date: String
show: Boolean
}`;

module.exports = { newsType, newsInput };
