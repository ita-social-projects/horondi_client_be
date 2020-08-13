function randomDateSince(start) {
    const today = new Date();
    return new Date(start.getTime() + Math.random() * (today.getTime() - start.getTime()))
}

function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

module.exports = {
    randomDateSince,
    addDays
};