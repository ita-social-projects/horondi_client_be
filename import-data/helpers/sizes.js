const mapToSizes = ({name=0, sizes=0, volume=0, weight=0}) => {
    const dimensions = {};
    if (name != 0) {
        dimensions['name'] = name;
    };
    if (sizes != 0 && sizes.length === 3) {
        dimensions['heightInCm'] = sizes[0];
        dimensions['widthInCm'] = sizes[1];
        dimensions['depthInCm'] = sizes[2]
    } else if (sizes != 0 && sizes.length === 2) {
        dimensions['heightInCm'] = sizes[0];
        dimensions['widthInCm'] = sizes[1]
    };
    if (volume != 0) {
        dimensions['volumeInLiters'] = volume;
    };
    if (weight != 0) {
        dimensions['weight'] = weight;
    };
    dimensions['available'] = true;
    return dimensions;
};

module.exports = {
    mapToSizes
};