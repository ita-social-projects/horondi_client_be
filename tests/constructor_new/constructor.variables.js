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
  pocketsWithRestrictions: [
    {
      currentPocketWithPosition: {
        pocket: '60e5aa55190df500240e1656',
        position: '60fff9f63affc3410c21ab54',
      },
      otherPocketsWithAvailablePositions: [
        {
          pocket: '60e5aa55190df500240e1656',
          positions: ['60fff9f63affc3410c21ab54'],
        },
      ],
    },
  ],
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
  pocketsWithRestrictions: [
    {
      currentPocketWithPosition: {
        pocket: '5fb712d8663cf10bec9faa1a',
        position: '5fb212d8663cf10bec9faa1a',
      },
      otherPocketsWithAvailablePositions: [
        {
          pocket: '5fb712d8663cf10bec9faa1a',
          positions: ['5fb412d8663cf12bec9faa1a'],
        },
      ],
    },
  ],
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
