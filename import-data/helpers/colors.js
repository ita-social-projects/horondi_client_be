const { mapToLanguages } = require('./languages');
const { mapToImages } = require('./images');

const mapToColors = (names) => {
    const colorsNumber = names.length;
    let result = [];
    for (let i = 0; i < colorsNumber; i++) {
        result.push({
            code: names[i][0],
            name: mapToLanguages([names[i][1], names[i][2]]),
            simpleName: mapToLanguages([names[i][3], names[i][4]]),
            images: mapToImages(names[i][2].toLowerCase()),
            available: true
        })
    };
    return result
  };

module.exports = {
    mapToColors
};