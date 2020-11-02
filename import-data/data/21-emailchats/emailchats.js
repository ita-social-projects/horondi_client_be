const { users } = require('../../helpers/users');
const model = [];

model.push({
  language:0,
  status:"ANSWERED",
  senderName:"Тарас",
  text:"Text",
  email:"ttar@fmail.com",
  date: new Date("2020-10-29T13:44:34.521Z"),
  answer:{
    admin: users[0].id,
    text:"hello",
    date: new Date("2020-10-31T17:24:55.889Z")
  }}
);

module.exports = model;
