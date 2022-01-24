const MaterialsBlock = `
type MaterialsBlock {
    id: ID
    heading: String
    title: String
    text: String
    image: String
  }
`;

const MaterialsBlockInput = `
input MaterialsBlockInput {
    heading: String
    title: String
    text: String
    image: String
  }
`;

module.exports = { MaterialsBlock, MaterialsBlockInput };
