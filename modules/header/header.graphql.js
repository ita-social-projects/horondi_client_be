const headerType = `
    type Header {
        _id: ID!
        title: [Language],
        link: String,
        priority: Int,
        translations_key: ID
    }
`;

const headerInput = `
    input HeaderInput {
        title: [LanguageInput],
        link: String,
        priority: Int,
        translations_key: ID
    }
`;

module.exports = { headerType, headerInput };
