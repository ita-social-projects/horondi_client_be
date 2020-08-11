const fs = require('fs');
const path = require('path');

const descPath = path.join(__dirname, '..', 'src');

const rolltopDescUK = fs.readFileSync(path.join(descPath, 'rolltopDescUK.html'), 'utf8').split('\n').join('');
const rolltopDescEN = fs.readFileSync(path.join(descPath, 'rolltopDescEN.html'), 'utf8').split('\n').join('');
const newDescUK = fs.readFileSync(path.join(descPath, 'newDescUK.html'), 'utf8').split('\n').join('');
const newDescEN = fs.readFileSync(path.join(descPath, 'newDescEN.html'), 'utf8').split('\n').join('');
const harbuzDescUK = fs.readFileSync(path.join(descPath, 'harbuzDescUK.html'), 'utf8').split('\n').join('');
const harbuzDescEN = fs.readFileSync(path.join(descPath, 'harbuzDescEN.html'), 'utf8').split('\n').join('');
const bagWithPatternDescUK = fs.readFileSync(path.join(descPath, 'bagWithPatternDescUK.html'), 'utf8').split('\n').join('');
const bagWithPatternDescEN = fs.readFileSync(path.join(descPath, 'bagWithPatternDescEN.html'), 'utf8').split('\n').join('');
const bagThreeColorsDescUK = fs.readFileSync(path.join(descPath, 'bagThreeColorsDescUK.html'), 'utf8').split('\n').join('');
const bagThreeColorsDescEN = fs.readFileSync(path.join(descPath, 'bagThreeColorsDescEN.html'), 'utf8').split('\n').join('');
const bagOneColorDescUK = fs.readFileSync(path.join(descPath, 'bagOneColorDescUK.html'), 'utf8').split('\n').join('');
const bagOneColorDescEN = fs.readFileSync(path.join(descPath, 'bagOneColorDescEN.html'), 'utf8').split('\n').join('');
const bagSimpleDescUK = fs.readFileSync(path.join(descPath, 'bagSimpleDescUK.html'), 'utf8').split('\n').join('');
const bagSimpleDescEN = fs.readFileSync(path.join(descPath, 'bagSimpleDescEN.html'), 'utf8').split('\n').join('');
const fannyPackLargeDescUK = fs.readFileSync(path.join(descPath, 'fannyPackLargeDescUK.html'), 'utf8').split('\n').join('');
const fannyPackLargeDescEN = fs.readFileSync(path.join(descPath, 'fannyPackLargeDescEN.html'), 'utf8').split('\n').join('');
const fannyPackSmallDescUK = fs.readFileSync(path.join(descPath, 'fannyPackSmallDescUK.html'), 'utf8').split('\n').join('');
const fannyPackSmallDescEN = fs.readFileSync(path.join(descPath, 'fannyPackSmallDescEN.html'), 'utf8').split('\n').join('');

module.exports = {
    rolltopDescUK,
    rolltopDescEN,
    newDescUK,
    newDescEN,
    harbuzDescUK,
    harbuzDescEN,
    bagWithPatternDescUK,
    bagWithPatternDescEN,
    bagThreeColorsDescUK,
    bagThreeColorsDescEN,
    bagOneColorDescUK,
    bagOneColorDescEN,
    bagSimpleDescUK,
    bagSimpleDescEN,
    fannyPackLargeDescUK,
    fannyPackLargeDescEN,
    fannyPackSmallDescUK,
    fannyPackSmallDescEN
}