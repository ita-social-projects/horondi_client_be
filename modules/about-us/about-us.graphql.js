const AboutUsBlock = `
type AboutUsBlock {
    id: ID
    title: String
    text: String
    image: String
  }
`;

const AboutUsBlockInput = `
input AboutUsBlockInput {
    title: String
    text: String
    image: String
  }
`;

module.exports = { AboutUsBlock, AboutUsBlockInput };
