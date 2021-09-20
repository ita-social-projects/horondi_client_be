const skip = 0;
const limit = 10;
const wrongId = '5fb312d8663cf10bec2faa1a';
const id = '5fb422d8663cf10bec2faa1a';
const filter = {
  name: '',
};

const newConstructorInputData = () => ({
  name: [
    { lang: 'ua', value: 'some constructor' },
    { lang: 'en', value: 'some constructor' },
  ],
  model: '5fb412d8663cf10bec9faa1a',
  basics: ['5fb412d8663cf10bec9faa1a'],
  bottoms: ['5fb412d8663cf10bec9faa1a'],
  patterns: ['5fb412d8663cf10bec9faa1a'],
  backs: ['5fb412d8663cf10bec9faa1a'],
  straps: ['5fb412d8663cf10bec9faa1a'],
  closures: ['5fb412d8663cf10bec9faa1a'],
  pockets: ['5fb412d8663cf10bec9faa1a'],
});
const newConstructorInputDataUpdate = () => ({
  name: [
    { lang: 'ua', value: 'updated constructor' },
    { lang: 'en', value: 'updated constructor' },
  ],
  model: '5fb412d8663cf10bec9faa1a',
  basics: ['5fb412d8663cf10bec9faa1a'],
  bottoms: ['5fb412d8663cf10bec9faa1a'],
  patterns: ['5fb412d8663cf10bec9faa1a'],
  backs: ['5fb412d8663cf10bec9faa1a'],
  straps: ['5fb412d8663cf10bec9faa1a'],
  closures: ['5fb412d8663cf10bec9faa1a'],
  pockets: ['5fb412d8663cf10bec9faa1a'],
});

module.exports = {
  skip,
  limit,
  filter,
  wrongId,
  newConstructorInputData,
  newConstructorInputDataUpdate,
  id,
};
