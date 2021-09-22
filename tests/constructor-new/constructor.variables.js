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
  model: '6043bf9e3e06ad3edcdb7b30',
  basics: ['5fb412d8663cf10bec9faa1a'],
  bottoms: ['613e04fad575811164aa5718'],
  patterns: ['6043b87c3e06ad3edcdb7b19'],
  backs: ['60eadfb9e913fc3f88294bd9'],
  straps: ['613e043dd575811164aa56fc'],
  closures: ['6043c8acc60c2e4b940189ae'],
  pockets: ['6043c8acc60c2e4b940189ae'],
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
  pockets: ['6043c8acc60c2e4b940189ae'],
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
