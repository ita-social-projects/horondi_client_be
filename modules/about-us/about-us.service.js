const AboutUs = require('./about-us.model');

class AboutUsService {
  async getAllBlocks() {
    return AboutUs.find({}).exec();
  }

  async addAboutBlock({ aboutUsBlock }) {
    const { title, text, image } = aboutUsBlock;
    return new AboutUs({ title, text, image }).save();
  }
}

module.exports = new AboutUsService();
