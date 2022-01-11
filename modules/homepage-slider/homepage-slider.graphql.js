const homePageSlideType = `  
type HomePageSlide {
    _id: ID!
    title: [Language],
    description: [Language],
    link:String,
    images: ImageSet,
    order: Int,
    show: Boolean,
    translations_key: ID
  }
`;

const homePageSlideInput = `  
input HomePageSlideInput {
    title: [LanguageInput],
    description: [LanguageInput],
    link:String,
    images:ImageSetInput
    order: Int,
    show: Boolean,
  }
`;

module.exports = {
  homePageSlideType,
  homePageSlideInput,
};
