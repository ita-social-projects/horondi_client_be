const headerType = `
    type Header {
        _id: ID!
        title: [Language],
        link: String,
        priority: Int,
    }
`;

const headerInput = `
    input HeaderInput {
        title: [LanguageInput],
        link: String,
        priority: Int,
    }
`;

module.exports = { headerType, headerInput };
