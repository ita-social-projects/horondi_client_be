const mapToImages = (name) => {
    return {
        large: 'large-'.concat(name).concat('.jpg'),
        medium: 'medium-'.concat(name).concat('.jpg'),
        small: 'small-'.concat(name).concat('.jpg'),
        thumbnail: 'thumbnail-'.concat(name).concat('.jpg')
    }
};

module.exports = {
    mapToImages
};