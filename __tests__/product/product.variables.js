const badProductId = '1a1111da11da1111111a111a';
const newProduct = {
  category: 'ddc81f5dbac48c38d0403dd3',
  subcategory: '688ded7be0c2621f2fb17b05',
  name: [
    { lang: 'en', value: 'Very Coool Baggy' },
    { lang: 'ua', value: 'ДУЖЕ СУПЕРСЬКИЙ Рюкзачечок' },
  ],
  description: [
    { lang: 'en', value: 'Baggy is so cool' },
    { lang: 'ua', value: 'Рюкзачечок - супер кльовий))' },
  ],
  mainMaterial: [
    {
      lang: 'uk',
      value: 'Canvas-400G прошита додатковим шаром спеціального матеріалу',
    },
    {
      lang: 'en',
      value:
        'Canvas-400G padded with a layer of durable and water-resistant material',
    },
  ],
  innerMaterial: [
    { lang: 'uk', value: 'Oxford 135' },
    { lang: 'en', value: 'Oxford 135' },
  ],
  pattern: [
    { lang: 'uk', value: 'Вишивка' },
    { lang: 'en', value: 'Embroidery' },
  ],
  patternImages: {
    large: 'large-embroidery.jpg',
    medium: 'medium-embroidery.jpg',
    small: 'small-embroidery.jpg',
    thumbnail: 'thumbnail-embroidery.jpg',
  },
  strapLengthInCm: 100,
  closure: [
    { lang: 'uk', value: 'Фастекс (пластикова защіпка)' },
    { lang: 'en', value: 'Plastic closure' },
  ],
  closureColor: 'black',
  basePrice: 1550,
  available: true,
  isHotItem: false,
  images: {
    primary: {
      large: 'large-primary_15.jpg',
      medium: 'medium-primary_15.jpg',
      small: 'small-primary_15.jpg',
      thumbnail: 'thumbnail-primary_15.jpg',
    },
    additional: [
      {
        large: 'large-additional_15_1.jpg',
        medium: 'medium-additional_15_1.jpg',
        small: 'small-additional_15_1.jpg',
        thumbnail: 'thumbnail-additional_15_1.jpg',
      },
      {
        large: 'large-additional_15_2.jpg',
        medium: 'medium-additional_15_2.jpg',
        small: 'small-additional_15_2.jpg',
        thumbnail: 'thumbnail-additional_15_2.jpg',
      },
      {
        large: 'large-additional_15_3.jpg',
        medium: 'medium-additional_15_3.jpg',
        small: 'small-additional_15_3.jpg',
        thumbnail: 'thumbnail-additional_15_3.jpg',
      },
    ],
  },
  colors: [
    {
      code: 206,
      name: [
        { lang: 'uk', value: 'Золотий' },
        { lang: 'en', value: 'Golden' },
      ],
      images: {
        large: 'large-golden.jpg',
        medium: 'medium-golden.jpg',
        small: 'small-golden.jpg',
        thumbnail: 'thumbnail-golden.jpg',
      },
      available: true,
      simpleName: [
        { lang: 'uk', value: 'жовтий' },
        { lang: 'en', value: 'yellow' },
      ],
    },
  ],
  options: [
    {
      size: '50288e8716e80d9569f64e2e',
      bottomMaterial: 'dadba32060da96e40847166d',
      description: [
        { lang: 'ua', value: 'Тканина Кордура' },
        { lang: 'en', value: 'Cordura fabric' },
      ],
      availableCount: 777,
      additions: [
        {
          available: true,
          name: [
            { lang: 'uk', value: 'Кишеня' },
            { lang: 'en', value: 'Pocket' },
          ],
          description: [
            { lang: 'uk', value: 'Бокова кишенька за бажанням' },
            { lang: 'en', value: 'Side pocket by request' },
          ],
          additionalPrice: 10000000,
        },
      ],
    },
  ],
};
const productForUpdate = {
  category: 'ddc81f5dbac48c38d0403dd3',
  subcategory: '688ded7be0c2621f2fb17b05',
  name: [
    { lang: 'en', value: 'Bad Baggy' },
    { lang: 'ua', value: 'Жахливий Рюкзачечок' },
  ],
  description: [
    { lang: 'en', value: 'Baggy is so bad' },
    { lang: 'ua', value: 'Рюкзачечок - не добрий))' },
  ],
  mainMaterial: [
    {
      lang: 'uk',
      value: 'Canvas-400QQ прошита без спеціального матеріалу',
    },
    {
      lang: 'en',
      value: 'Canvas-400G padded without a layer water-resistant material',
    },
  ],
  innerMaterial: [
    { lang: 'uk', value: 'Oxford 185' },
    { lang: 'en', value: 'Oxford 185' },
  ],
  pattern: [
    { lang: 'uk', value: 'Вишивочка' },
    { lang: 'en', value: 'Embroidery' },
  ],
  patternImages: {
    large: 'large-embroidery.jpg',
    medium: 'medium-embroidery.jpg',
    small: 'small-embroidery.jpg',
    thumbnail: 'thumbnail-embroidery.jpg',
  },
  strapLengthInCm: 100,
  closure: [
    { lang: 'uk', value: 'Фастекс (пластикова защіпка)' },
    { lang: 'en', value: 'Plastic closure' },
  ],
  closureColor: 'white',
  basePrice: 7777,
  available: false,
  isHotItem: true,
  images: {
    primary: {
      large: 'large-primary_15_1.jpg',
      medium: 'medium-primary_15_1.jpg',
      small: 'small-primary_15_1.jpg',
      thumbnail: 'thumbnail-primary_15_1.jpg',
    },
    additional: [
      {
        large: 'large-additional_15_2.jpg',
        medium: 'medium-additional_15_2.jpg',
        small: 'small-additional_15_2.jpg',
        thumbnail: 'thumbnail-additional_15_2.jpg',
      },
      {
        large: 'large-additional_15.jpg',
        medium: 'medium-additional_15.jpg',
        small: 'small-additional_15.jpg',
        thumbnail: 'thumbnail-additional_15.jpg',
      },
      {
        large: 'large-additional_15_2.jpg',
        medium: 'medium-additional_15_2.jpg',
        small: 'small-additional_15_2.jpg',
        thumbnail: 'thumbnail-additional_15_2.jpg',
      },
    ],
  },
  colors: [
    {
      code: 206,
      name: [
        { lang: 'uk', value: 'Златий' },
        { lang: 'en', value: 'Goldy' },
      ],
      images: {
        large: 'large-golden.jpg',
        medium: 'medium-golden.jpg',
        small: 'small-golden.jpg',
        thumbnail: 'thumbnail-golden.jpg',
      },
      available: true,
      simpleName: [
        { lang: 'uk', value: 'жовтий' },
        { lang: 'en', value: 'yellow' },
      ],
    },
  ],
  options: [
    {
      size: '50288e8716e80d9569f64e2e',
      bottomMaterial: 'dadba32060da96e40847166d',
      description: [
        { lang: 'ua', value: 'Тканина Кордура' },
        { lang: 'en', value: 'Cordura fabric' },
      ],
      availableCount: 50,
      additions: [
        {
          available: true,
          name: [
            { lang: 'uk', value: 'Кишеня' },
            { lang: 'en', value: 'Pocket' },
          ],
          description: [
            { lang: 'uk', value: 'Бокова кишенька за бажанням' },
            { lang: 'en', value: 'Side pocket by request' },
          ],
          additionalPrice: 100,
        },
      ],
    },
  ],
};
const expectedResult = {
  __typename: 'Product',
  available: true,
  basePrice: 1550,
  category: {
    __typename: 'Category',
    _id: 'ddc81f5dbac48c38d0403dd3',
  },
  closureColor: 'black',
  description: [
    {
      __typename: 'Language',
      value: 'Baggy is so cool',
    },
    {
      __typename: 'Language',
      value: 'Рюкзачечок - супер кльовий))',
    },
  ],
  innerMaterial: [
    {
      __typename: 'Language',
      value: 'Oxford 135',
    },
    {
      __typename: 'Language',
      value: 'Oxford 135',
    },
  ],
  isHotItem: false,
  mainMaterial: [
    {
      __typename: 'Language',
      value: 'Canvas-400G прошита додатковим шаром спеціального матеріалу',
    },
    {
      __typename: 'Language',
      value:
        'Canvas-400G padded with a layer of durable and water-resistant material',
    },
  ],
  name: [
    {
      __typename: 'Language',
      value: 'Very Coool Baggy',
    },
    {
      __typename: 'Language',
      value: 'ДУЖЕ СУПЕРСЬКИЙ Рюкзачечок',
    },
  ],
  pattern: [
    {
      __typename: 'Language',
      value: 'Вишивка',
    },
    {
      __typename: 'Language',
      value: 'Embroidery',
    },
  ],
  purchasedCount: null,
  rate: null,
  rateCount: null,
  strapLengthInCm: 100,
  subcategory: {
    __typename: 'Category',
    _id: '688ded7be0c2621f2fb17b05',
  },
};

const sameNameForUpdate = {
  category: 'ddc81f5dbac48c38d0403dd3',
  subcategory: '688ded7be0c2621f2fb17b05',
  description: [
    { lang: 'en', value: 'Baggy is so cool' },
    { lang: 'ua', value: 'Рюкзачечок - супер кльовий))' },
  ],
  name: [
    { lang: 'en', value: 'Baggy!!!' },
    { lang: 'ua', value: 'Рюкзачечок!!!!' },
  ],
  mainMaterial: [
    {
      lang: 'uk',
      value: 'Canvas-400B прошита додатковим шаром спеціального матеріалу',
    },
    {
      lang: 'en',
      value:
        'Canvas-400B padded with a layer of durable and water-resistant material',
    },
  ],
  innerMaterial: [
    { lang: 'uk', value: 'Oxford 135' },
    { lang: 'en', value: 'Oxford 135' },
  ],
  patternImages: {
    large: 'large-embroidery.jpg',
    medium: 'medium-embroidery.jpg',
    small: 'small-embroidery.jpg',
    thumbnail: 'thumbnail-embroidery.jpg',
  },
  pattern: [
    { lang: 'uk', value: 'Вишивка' },
    { lang: 'en', value: 'Embroidery' },
  ],
  strapLengthInCm: 100,
  closure: [
    { lang: 'uk', value: 'Фастекс (пластикова защіпка)' },
    { lang: 'en', value: 'Plastic closure' },
  ],
  closureColor: 'black',
  basePrice: 1550,
  available: true,
  isHotItem: false,
  images: {
    additional: [
      {
        large: 'large-additional_15_1.jpg',
        medium: 'medium-additional_15_1.jpg',
        small: 'small-additional_15_1.jpg',
        thumbnail: 'thumbnail-additional_15_1.jpg',
      },
      {
        large: 'large-additional_15_2.jpg',
        medium: 'medium-additional_15_2.jpg',
        small: 'small-additional_15_2.jpg',
        thumbnail: 'thumbnail-additional_15_2.jpg',
      },
      {
        large: 'large-additional_15_3.jpg',
        medium: 'medium-additional_15_3.jpg',
        small: 'small-additional_15_3.jpg',
        thumbnail: 'thumbnail-additional_15_3.jpg',
      },
    ],
    primary: {
      large: 'large-primary_15.jpg',
      medium: 'medium-primary_15.jpg',
      small: 'small-primary_15.jpg',
      thumbnail: 'thumbnail-primary_15.jpg',
    },
  },
  colors: [
    {
      code: 206,
      name: [
        { lang: 'uk', value: 'Золотий' },
        { lang: 'en', value: 'Golden' },
      ],
      available: true,
      simpleName: [
        { lang: 'uk', value: 'жовтий' },
        { lang: 'en', value: 'yelow' },
      ],
      images: {
        large: 'large-golden.jpg',
        medium: 'medium-golden.jpg',
        small: 'small-golden.jpg',
        thumbnail: 'thumbnail-golden.jpg',
      },
    },
  ],
  options: [
    {
      size: '50288e8716e80d9569f64e2e',
      bottomMaterial: 'dadba32060da96e40847166d',
      description: [
        { lang: 'ua', value: 'Тканина Кордура' },
        { lang: 'en', value: 'Cordura fabric' },
      ],
      availableCount: 7,
      additions: [
        {
          available: true,
          name: [
            { lang: 'uk', value: 'Кишеня' },
            { lang: 'en', value: 'Pocket' },
          ],
          description: [
            { lang: 'uk', value: 'Бокова кишенька за бажанням' },
            { lang: 'en', value: 'Side pocket by request' },
          ],
          additionalPrice: 100,
        },
      ],
    },
  ],
};
module.exports = {
  badProductId,
  newProduct,
  productForUpdate,
  expectedResult,
  sameNameForUpdate,
};
