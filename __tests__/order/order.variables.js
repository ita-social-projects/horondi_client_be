const newOrder = {
  "status":"pending",
  "user":{
    "firstName":"Test",
    "lastName":"Test",
    "email":"test@gmail.com",
    "phoneNumber":"380953544271",
    "address":{
      "country":"Україна",
      "region":"Кіровоградська область",
      "city":"Новомиргород",
      "zipcode":98908,
      "street":"Бульвар Марії Приймаченко",
      "buildingNumber":"25",
      "appartment":"97"
    }
  },
  "delivery":{
    "sentBy":"Nova Poshta",
    "invoiceNumber":"6280260"
  },
  "items":[
    {
      "category":[
        {
          "lang":"uk",
          "value":"Сумки"
        },
        {
          "lang":"en",
          "value":"Bags"
        }
      ],
      "subcategory":[
        {
          "lang":"uk",
          "value":"Сумки"
        },
        {
          "lang":"en",
          "value":"Bags"
        }
      ],
      "model":
      [
        {
          "lang":"uk",
          "value":"Сумка з гобеленом"
        },
        {
          "lang":"en",
          "value":"Bag with a Pattern"
        }
      ],
      "name":[
        {"lang":"uk",
        "value":"Сумка з гобеленом синя"
      },
      {
        "lang":"en",
        "value":"Bag with a Pattern Blue"
      }
    ],
    "colors":[
      [
        {
          "lang":"uk",
          "value":"Сталево-блакитний"
        },
        {
          "lang":"en",
          "value":"Steel-blue"
        }
      ]
    ],
    "pattern":[
      {
        "lang":"uk",
        "value":"Олені"
      },
      {
        "lang":"en",
        "value":"Deers"
      }
    ],
    "closure":[],
    "closureColor":"",
    "size":{
      "heightInCm":38,
      "widthInCm":36,
      "depthInCm":10,
      "volumeInLiters":0,
      "weightInKg":0
    },
    "bottomMaterial":[
      {
        "lang":"uk",
        "value":"Тканина Кордура"
      },
      {
        "lang":"en",
        "value":"Cordura fabric"
      }
    ],
    "bottomColor":[
      {
        "lang":"uk",
        "value":"чорний"
      },
      {
        "lang":"en",
        "value":"black"
      }
    ],
    "additions":[],
    "actualPrice":[
      {
        "currency":"UAH",
        "value":90000
      },
      {
        "currency":"USD",
        "value":3246
      }
    ],
    "quantity":1
  }],
  "paymentMethod":
  "card",
  "totalPrice":[
    {
      "currency":"UAH",
      "value":90000
    },
    {
      "currency":"USD",
      "value":3246
    }
  ]
}

const newOrderMutation = {
  ...newOrder,
  "status":"sent",
}

const updatedData = {
  "user":{
    "firstName":"Updated",
    "lastName":"Updated",
    "email":"test@gmail.com",
    "phoneNumber":"380953544271",
    "address":{
      "country":"Україна",
      "region":"Кіровоградська область",
      "city":"Новомиргород",
      "zipcode":98908,
      "street":"вулиця Шевченка",
      "buildingNumber":"12",
      "appartment":"2"
    }
  },
  "totalPrice":[
    {
      "currency":"UAH",
      "value":9000
    },
    {
      "currency":"USD",
      "value":324
    }
  ]
}

const newOrderUpdated = {
  ...newOrderMutation,
  ...updatedData
}

const orderResult = {
  status:"pending",
  user:{
    __typename: "OrderUser",
    firstName:"Test",
    lastName:"Test",
    email: "test@gmail.com",
    phoneNumber:"380953544271",
    address: {
      __typename: "Address",
      country:"Україна",
      region:"Кіровоградська область",
      city:"Новомиргород",
      zipcode:98908,
      street:"Бульвар Марії Приймаченко",
      buildingNumber:"25",
      appartment:"97"
    }
  },
  delivery:{
    __typename: "Delivery",
    sentBy:"Nova Poshta",
    invoiceNumber:"6280260"
  },
  items:[
    {
      __typename: "OrderItems",
      category:[
        {
          __typename: "Language",
          lang:"uk",
          value:"Сумки"
        },
        {
          __typename: "Language",
          lang:"en",
          value:"Bags"
        }
      ],
      subcategory:[
        {
          __typename: "Language",
          lang:"uk",
          value:"Сумки"
        },
        {
          __typename: "Language",
          lang:"en",
          value:"Bags"
        }
      ],
      model:
      [
        {
          __typename: "Language",
          lang:"uk",
          value:"Сумка з гобеленом"
        },
        {
          __typename: "Language",
          lang:"en",
          value:"Bag with a Pattern"
        }
      ],
      name:[
        {
          __typename: "Language",
          lang:"uk",
          value:"Сумка з гобеленом синя"
        },
        {
          __typename: "Language",
          lang:"en",
          value:"Bag with a Pattern Blue"
        }
      ],
      colors:[
        [
          {
            __typename: "Language",
            lang:"uk",
            value:"Сталево-блакитний"
          },
          {
            __typename: "Language",
            lang:"en",
            value:"Steel-blue"
          }
        ]
      ],
      pattern:[
        {
          __typename: "Language",
          lang:"uk",
          value:"Олені"
        },
        {
          __typename: "Language",
          lang:"en",
          value:"Deers"
        }
      ],
      closure:[],
      closureColor:"",
      size:{
        __typename: "Size",
        heightInCm:38,
        widthInCm:36,
        depthInCm:10,
        volumeInLiters:0,
        weightInKg:0
      },
      bottomMaterial:[
        {
          __typename: "Language",
          lang:"uk",
          value:"Тканина Кордура"
        },
        {
          __typename: "Language",
          lang:"en",
          value:"Cordura fabric"
        }
      ],
      bottomColor:[
        {
          __typename: "Language",
          lang:"uk",
          value:"чорний"
        },
        {
          __typename: "Language",
          lang:"en",
          value:"black"
        }
      ],
      additions:[],
      actualPrice:[
        {
          __typename: "CurrencySet",
          currency:"UAH",
          value:90000
        },
        {
          __typename: "CurrencySet",
          currency:"USD",
          value:3246
        }
      ],
      quantity:1
    }],
    paymentMethod:"card",
    totalPrice:[
      {
        __typename: "CurrencySet",
        currency:"UAH",
        value:90000
      },
      {
        __typename: "CurrencySet",
        currency:"USD",
        value:3246
      }
    ]
}

const orderCreateResult = {
  ...orderResult,
  status:"sent"
}

const updateResultData = {
  user:{
    __typename: "OrderUser",
    firstName:"Updated",
    lastName:"Updated",
    email: "test@gmail.com",
    phoneNumber:"380953544271",
    address: {
      __typename: "Address",
      country:"Україна",
      region:"Кіровоградська область",
      city:"Новомиргород",
      zipcode:98908,
      street:"вулиця Шевченка",
      buildingNumber:"12",
      appartment:"2"
    }
  },
  totalPrice:[
    {
      __typename: "CurrencySet",
      currency:"UAH",
      value:9000
    },
    {
      __typename: "CurrencySet",
      currency:"USD",
      value:324
    }
  ]
}

const orderUpdateResult = {
  ...orderCreateResult,
  ...updateResultData 
}

module.exports = {
  newOrder,
  newOrderUpdated,
  newOrderMutation,
  orderCreateResult,
  orderResult,
  orderUpdateResult
}