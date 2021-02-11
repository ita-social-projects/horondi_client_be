const sharedFields = `

  _id: ID!
  code: String!
  name: [Language]
  images: ImageSet
  available: Boolean
`;
const categoryType = `
  type Category {
    ${sharedFields}
  }
  type CategoryWithModels {
    ${sharedFields}
    models: [Model]
  }
`;
const paginatedCategory = `
	type PaginatedCategory {
		items: [Category]
		count: Int
	}
`;

const categoryInput = `
  input CategoryInput {
    code: String
    name: [LanguageInput]
    images: ImageSetInput
    available: Boolean
	}`;

const FilterInputComponent = `
  input FilterInputComponent {
    roles: [String!]
		banned: [Boolean]
		category: [ID]
    search: String
}
`;

const SortInputComponent = `
	input SortInputComponent {
		name: Int
		email: Int
	}
`;

module.exports = {
  categoryType,
  categoryInput,
  FilterInputComponent,
  SortInputComponent,
  paginatedCategory,
};
