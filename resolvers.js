const Currency = require('./models/Currency');
const News = require('./models/News');

const Material = require('./modules/materials/materials.services');
const Pattern = require('./modules/patterns/patterns.services');
const Category = require('./modules/categories/categories.services');

const resolvers = {
  Query: {
    currencies: () => Currency.find(),
    currency: (parent, args) => Currency.findById(args.id),

    getAllCategories: () => Category.getAllCategories(),
    getCategoryById: (parent, args) => Category.getCategoryById(args.id),

    allNews: () => News.find(),
    oneNews: (parent, args) => News.findById(args.id),

    getAllMaterials: () => Material.getAllMaterials(),
    getMaterialById: (parent, args) => Material.getMaterialById(args.id),
    
    getAllPatterns: () => Pattern.getAllPatterns(),
    getPatternById: (parent, args) => Pattern.getPatternById(args.id),
  }
};

module.exports = resolvers;
