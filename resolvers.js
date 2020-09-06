const { newsQuery, newsMutation } = require('./modules/news/news.resolver');
const { userQuery, userMutation } = require('./modules/user/user.resolver');
const {
  productsQuery,
  productsMutation,
} = require('./modules/product/product.resolver');

const {
  commentsQuery,
  commentsMutation,
} = require('./modules/comment/comment.resolver');

const {
  contactQuery,
  contactMutation,
} = require('./modules/contact/contact.resolver');

const {
  currencyQuery,
  currencyMutation,
} = require('./modules/currency/currency.resolver');
const {
  materialQuery,
  materialMutation,
} = require('./modules/material/material.resolver');
const {
  modelsQuery,
  modelsMutation,
} = require('./modules/model/model.resolver');
const {
  patternQuery,
  patternMutation,
} = require('./modules/pattern/pattern.resolver');
const {
  categoryQuery,
  categoryMutation,
} = require('./modules/category/category.resolver');
const categoryService = require('./modules/category/category.service');
const userService = require('./modules/user/user.service');
const productsService = require('./modules/product/product.service');
const materialsService = require('./modules/material/material.service');
const commentsService = require('./modules/comment/comment.service');
const {
  uploadMutation
} = require('./modules/upload/upload.resolver');

const SCHEMA_NAMES = {
  category: 'Category',
  news: 'News',
  pattern: 'Pattern',
  material: 'Material',
  currency: 'Currency',
  product: 'Product',
  comment: 'Comment',
  successfulResponse: 'SuccessfulResponse',
  model: 'Model',
  contact: 'Contact',
  user: 'User'
};
const resolvers = {
  Query: {
    ...currencyQuery,

    ...materialQuery,

    ...patternQuery,

    ...categoryQuery,

    ...newsQuery,

    ...userQuery,

    ...productsQuery,

    ...commentsQuery,

    ...modelsQuery,
    
    ...contactQuery,
  },
  Comment: {
    product: parent => productsService.getProductById(parent.product),
  },

  Product: {
    category: parent => categoryService.getCategoryById(parent.category),
    subcategory: parent => categoryService.getCategoryById(parent.subcategory),
    comments: parent => commentsService.getAllCommentsByProduct(parent._id),
  },

  Model: {
    category: parent => categoryService.getCategoryById(parent.category),
    subcategory: parent => categoryService.getCategoryById(parent.subcategory),
  },

  ProductOptions: {
    size: parent => productsService.getSizeById(parent.size),
    bottomMaterial: parent => materialsService.getMaterialById(parent.bottomMaterial),
  },

  UserRate: {
    user: parent => userService.getUserByFieldOrThrow('_id', parent.user),
  },

  Mutation: {
    ...uploadMutation,

    ...patternMutation,

    ...materialMutation,

    ...categoryMutation,

    ...currencyMutation,

    ...newsMutation,

    ...userMutation,

    ...productsMutation,

    ...commentsMutation,

    ...modelsMutation,
    
    ...contactMutation,
  },
  CategoryResult: {
    __resolveType: obj => {
      if (obj.name) {
        return SCHEMA_NAMES.category;
      }
      return 'Error';
    },
  },
  CurrencyResult: {
    __resolveType: obj => {
      if (obj.date) {
        return SCHEMA_NAMES.currency;
      }
      return 'Error';
    },
  },
  NewsResult: {
    __resolveType: obj => {
      if (obj.title) {
        return SCHEMA_NAMES.news;
      }
      return 'Error';
    },
  },
  MaterialResult: {
    __resolveType: obj => {
      if (obj.name) {
        return SCHEMA_NAMES.material;
      }
      return 'Error';
    },
  },
  PatternResult: {
    __resolveType: obj => {
      if (obj.name) {
        return SCHEMA_NAMES.pattern;
      }
      return 'Error';
    },
  },
  ProductResult: {
    __resolveType: obj => {
      if (obj.name) {
        return SCHEMA_NAMES.product;
      }
      return 'Error';
    },
  },
  CommentResult: {
    __resolveType: obj => {
      if (obj.product) {
        return SCHEMA_NAMES.comment;
      }
      return 'Error';
    },
  },
  LogicalResult: {
    __resolveType: obj => {
      if (obj.isSuccess) {
        return SCHEMA_NAMES.successfulResponse;
      }
      return 'Error';
    },
  },
  ModelResult: {
    __resolveType: obj => {
      if (obj.name) {
        return SCHEMA_NAMES.model;
      }
      return 'Error';
    }
  },
  ContactResult: {
    __resolveType: obj => {
      if (obj.address) {
        return SCHEMA_NAMES.contact;
      }
      return 'Error';
    },
  },
  UserResult: {
    __resolveType: obj => {
      if (obj.email) {
        return SCHEMA_NAMES.user;
      }
      return 'Error';
    }
  }
};

module.exports = resolvers;
