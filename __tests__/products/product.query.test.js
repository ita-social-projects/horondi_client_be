/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');

require('dotenv').config();

let productId;

describe('queries', () => {
  beforeAll(async () => {
    const createProduct = await client.mutate({
      mutation: gql`
          mutation {
            addProduct(
                product: { 
                    "subcategory": "688ded7be0c2621f2fb17b05",
                    "name":[{
                      "lang":"en",
                      "value":"Baggy"
                    },{
                        "lang":"ua",
                      "value":"Рюкзачечок))"
                    }],
                    "description":[{
                      "lang":"en",
                      "value":"Baggy is so cool"
                    },{
                        "lang":"ua",
                      "value":"Рюкзачечок - супер кльовий))"
                    }],
                    "mainMaterial": [
                          {
                            "lang": "uk",
                            "value": "Canvas-400G прошита додатковим шаром спеціального матеріалу, який зміцнює та захищає від води + підкладка"
                          },
                          {
                            "lang": "en",
                            "value": "Canvas-400G padded with a layer of durable and water-resistant material + inner layer"
                          }
                    ],
                    "innerMaterial": [
                          {
                            "lang": "uk",
                            "value": "Oxford 135"
                          },
                          {
                            "lang": "en",
                            "value": "Oxford 135"
                          }
                    ],
                    "strapLengthInCm": 100,
                    "images": [
                          {
                            "primary": {
                              "large": "large-primary_15.jpg",
                              "medium": "medium-primary_15.jpg",
                              "small": "small-primary_15.jpg",
                              "thumbnail": "thumbnail-primary_15.jpg"
                            },
                            "additional": [
                              {
                                "large": "large-additional_15_1.jpg",
                                "medium": "medium-additional_15_1.jpg",
                                "small": "small-additional_15_1.jpg",
                                "thumbnail": "thumbnail-additional_15_1.jpg"
                              },
                              {
                                "large": "large-additional_15_2.jpg",
                                "medium": "medium-additional_15_2.jpg",
                                "small": "small-additional_15_2.jpg",
                                "thumbnail": "thumbnail-additional_15_2.jpg"
                              },
                              {
                                "large": "large-additional_15_3.jpg",
                                "medium": "medium-additional_15_3.jpg",
                                "small": "small-additional_15_3.jpg",
                                "thumbnail": "thumbnail-additional_15_3.jpg"
                              }
                            ]
                          }
                    ],
                    "colors": [
                          {
                            "code": 206,
                            "name": [
                              {
                                "lang": "uk",
                                "value": "Золотий"
                              },
                              {
                                "lang": "en",
                                "value": "Golden"
                              }
                            ],
                            "images": {
                              "large": "large-golden.jpg",
                              "medium": "medium-golden.jpg",
                              "small": "small-golden.jpg",
                              "thumbnail": "thumbnail-golden.jpg"
                            },
                            "available": true,
                            "simpleName": [
                              {
                                "lang": "uk",
                                "value": "жовтий"
                              },
                              {
                                "lang": "en",
                                "value": "yellow"
                              }
                            ]
                          },
                          {
                            "code": 207,
                            "name": [
                              {
                                "lang": "uk",
                                "value": "Темно-оливковий"
                              },
                              {
                                "lang": "en",
                                "value": "Dark-olive"
                              }
                            ],
                            "images": {
                              "large": "large-dark-olive.jpg",
                              "medium": "medium-dark-olive.jpg",
                              "small": "small-dark-olive.jpg",
                              "thumbnail": "thumbnail-dark-olive.jpg"
                            },
                            "available": true,
                            "simpleName": [
                              {
                                "lang": "uk",
                                "value": "зелений"
                              },
                              {
                                "lang": "en",
                                "value": "green"
                              }
                            ]}],
                    "pattern": [
                          {
                            "lang": "uk",
                            "value": "Вишивка"
                          },
                          {
                            "lang": "en",
                            "value": "Embroidery"
                          }
                        ],
                    "patternImages": {
                          "large": "large-embroidery.jpg",
                          "medium": "medium-embroidery.jpg",
                          "small": "small-embroidery.jpg",
                          "thumbnail": "thumbnail-embroidery.jpg"
                        },
                    "closure": [
                          {
                            "lang": "uk",
                            "value": "Фастекс (пластикова защіпка)"
                          },
                          {
                            "lang": "en",
                            "value": "Plastic closure"
                          }
                        ],
                    "closureColor": "black",
                    "basePrice": 1550,
                    "available": true,
                    "isHotItem": false,
                      "options": [
                          {
                            "size": "7cbab800e16d3ac6bb7288f7",
                            "bottomMaterial": "dadba32060da96e40847166d",
                              "description": [
                                {
                                  "lang": "uk",
                                  "value": "Шкірзамінник"
                                },
                                {
                                  "lang": "en",
                                  "value": "Faux leather"
                                }
                              ],
                              "colors": [
                                {
                                  "code": 1,
                                  "name": [
                                    {
                                      "lang": "uk",
                                      "value": "Чорний"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "Black"
                                    }
                                  ],
                                  "images": {
                                    "large": "large-black.jpg",
                                    "medium": "medium-black.jpg",
                                    "small": "small-black.jpg",
                                    "thumbnail": "thumbnail-black.jpg"
                                  },
                                  "available": true,
                                  "simpleName": [
                                    {
                                      "lang": "uk",
                                      "value": "чорний"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "black"
                                    }
                                  ]
                                },
                                {
                                  "code": 2,
                                  "name": [
                                    {
                                      "lang": "uk",
                                      "value": "Коричневий"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "Brown"
                                    }
                                  ],
                                  "images": {
                                    "large": "large-brown.jpg",
                                    "medium": "medium-brown.jpg",
                                    "small": "small-brown.jpg",
                                    "thumbnail": "thumbnail-brown.jpg"
                                  },
                                  "available": true,
                                  "simpleName": [
                                    {
                                      "lang": "uk",
                                      "value": "коричневий"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "brown"
                                    }
                                  ]
                                },
                                {
                                  "code": 3,
                                  "name": [
                                    {
                                      "lang": "uk",
                                      "value": "Сірий"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "Grey"
                                    }
                                  ],
                                  "images": {
                                    "large": "large-grey.jpg",
                                    "medium": "medium-grey.jpg",
                                    "small": "small-grey.jpg",
                                    "thumbnail": "thumbnail-grey.jpg"
                                  },
                                  "available": true,
                                  "simpleName": [
                                    {
                                      "lang": "uk",
                                      "value": "сірий"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "grey"
                                    }
                                  ]
                                },
                                {
                                  "code": 4,
                                  "name": [
                                    {
                                      "lang": "uk",
                                      "value": "Рожевий"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "Pink"
                                    }
                                  ],
                                  "images": {
                                    "large": "large-pink.jpg",
                                    "medium": "medium-pink.jpg",
                                    "small": "small-pink.jpg",
                                    "thumbnail": "thumbnail-pink.jpg"
                                  },
                                  "available": true,
                                  "simpleName": [
                                    {
                                      "lang": "uk",
                                      "value": "рожевий"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "pink"
                                    }
                                  ]
                                }
                              ]
                            },
                            "bottomColor": [
                              {
                                "lang": "uk",
                                "value": "чорний"
                              },
                              {
                                "lang": "en",
                                "value": "black"
                              }
                            ],
                            "availableCount": false,
                            "additions": []
                          },
                          {
                            "size": "7cbab800e16d3ac6bb7288f7",
                            "bottomMaterial": "dadba32060da96e40847166d",
                                {
                                  "lang": "en",
                                  "value": "Cordura fabric"
                                }
                              ],
                              "description": [
                                {
                                  "lang": "uk",
                                  "value": "Тканина Кордура"
                                },
                                {
                                  "lang": "en",
                                  "value": "Cordura fabric"
                                }
                              ],
                              "colors": [
                                {
                                  "code": 1,
                                  "name": [
                                    {
                                      "lang": "uk",
                                      "value": "Чорний"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "Black"
                                    }
                                  ],
                                  "images": {
                                    "large": "large-black.jpg",
                                    "medium": "medium-black.jpg",
                                    "small": "small-black.jpg",
                                    "thumbnail": "thumbnail-black.jpg"
                                  },
                                  "available": true,
                                  "simpleName": [
                                    {
                                      "lang": "uk",
                                      "value": "чорний"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "black"
                                    }
                                  ]
                                }
                              ]
                            },
                            "bottomColor": [
                              {
                                "lang": "uk",
                                "value": "чорний"
                              },
                              {
                                "lang": "en",
                                "value": "black"
                              }
                            ],
                            "availableCount": true,
                            "additions": []
                          },
                          {
                            "size": "7cbab800e16d3ac6bb7288f7",
                            "bottomMaterial": "dadba32060da96e40847166d",
                              "description": [
                                {
                                  "lang": "uk",
                                  "value": "Натуральна шкіра"
                                },
                                {
                                  "lang": "en",
                                  "value": "Genuine leather"
                                }
                              ],
                              "colors": [
                                {
                                  "code": 1,
                                  "name": [
                                    {
                                      "lang": "uk",
                                      "value": "Чорний"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "Black"
                                    }
                                  ],
                                  "images": {
                                    "large": "large-black.jpg",
                                    "medium": "medium-black.jpg",
                                    "small": "small-black.jpg",
                                    "thumbnail": "thumbnail-black.jpg"
                                  },
                                  "available": true,
                                  "simpleName": [
                                    {
                                      "lang": "uk",
                                      "value": "чорний"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "black"
                                    }
                                  ]
                                },
                                {
                                  "code": 2,
                                  "name": [
                                    {
                                      "lang": "uk",
                                      "value": "Коричневий"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "Brown"
                                    }
                                  ],
                                  "images": {
                                    "large": "large-brown.jpg",
                                    "medium": "medium-brown.jpg",
                                    "small": "small-brown.jpg",
                                    "thumbnail": "thumbnail-brown.jpg"
                                  },
                                  "available": true,
                                  "simpleName": [
                                    {
                                      "lang": "uk",
                                      "value": "коричневий"
                                    },
                                    {
                                      "lang": "en",
                                      "value": "brown"
                                    }
                                  ]
                                }
                              ]
                            },
                            "bottomColor": [
                              {
                                "lang": "uk",
                                "value": "чорний"
                              },
                              {
                                "lang": "en",
                                "value": "black"
                              }
                            ],
                            "availableCount": true,
                            "additions": []
                          }
                        ]
                    }}
            ) {
              _id
            }
          }
        `,
    });
    productId = createProduct.data.addProduct._id;
    console.log(productId);
  });
});
