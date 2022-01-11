const newsType = `
type News {
_id: ID!
title: [Language]
slug: String
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
image: Upload
author: AuthorInput
date: String
show: Boolean
languages: [String]
}

input NewsFilterInput{
    search:String
  }
`;

module.exports = { newsType, newsInput };
