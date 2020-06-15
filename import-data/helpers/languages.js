const languages = ['uk', 'en'];
const langNumber = languages.length;

const mapToLanguages = (names) => {
    let result = [];
    for (let i = 0; i < langNumber; i++) {
        result.push({
            lang: languages[i],
            value: names[i]
        })
    };
    return result
  };

module.exports = {
    mapToLanguages
};