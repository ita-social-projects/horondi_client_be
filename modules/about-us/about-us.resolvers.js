const aboutUsService = require('./about-us.service');

const aboutUsQuery = {
  getAllBlocks: () => aboutUsService.getAllBlocks(),
};

const aboutUsMutation = {
  addAboutUsBlock: (_, aboutUsBlock) =>
    aboutUsService.addAboutBlock(aboutUsBlock),
};

module.exports = { aboutUsQuery, aboutUsMutation };
