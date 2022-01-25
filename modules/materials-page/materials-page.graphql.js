const MaterialsBlock = `
type MaterialsBlock {
    _id: ID
    heading: String
    text: String
    image: String
  }
`;

const MaterialsBlockInput = `
input MaterialsBlockInput {
    heading: String
    text: String
    image: String
  }
`;

module.exports = { MaterialsBlock, MaterialsBlockInput };
