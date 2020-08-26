const mapToImages = (name) => {
    return {
        large: 'large_'.concat(name),
        medium: 'medium_'.concat(name),
        small: 'small_'.concat(name),
        thumbnail: 'thumbnail_'.concat(name)
    }
};

module.exports = {
    mapToImages
};