/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apolloClient');

require('dotenv').config();

let token

describe('queries', () => {
    beforeEach(async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation {       
                    loginUser(user: {
                        email: "tacjka334@gmail.com"
                        password: "12345678Pt"
                    }) {
                        token
                    }
                }
            `
        })
        token = res.data.loginUser.token
    });


    test('should recive all users', async () => {
        const res = await client.query({
            query: gql`
                query {       
                    getAllUsers{
                        email
                        firstName
                        lastName
                        phoneNumber
                        purchasedProducts
                        role
                        orders
                        wishlist
                        credentials{
                            source
                            tokenPass
                        }
                        registrationDate
                        address{
                            country
                            city
                            street
                            appartment
                            buildingNumber
                        }
                    }
                }
            `
        })
         expect(res.data.getAllUsers).toContainEqual({
            "email": "adj0959pza@gmail.com",
            "firstName": "Ніл",
            "lastName": "Бабич",
            "phoneNumber": "380396032485",
            "purchasedProducts": [],
            "role": "user",
            "orders": [
              "83ee481820a2056b8e5cc015"
            ],
            "wishlist": [
              "f94fe36ef59ff80fe02afb28"
            ],
            "credentials": [
              {
                "source": "google",
                "tokenPass": "IHOI2HOL8O"
              }
            ],
            "registrationDate": "1552340261653",
            "address": {
              "country": "Україна",
              "city": "Ніжин",
              "street": "Вулиця Спокійна",
              "appartment": "48",
              "buildingNumber": "12"
            }
          });

    })

    test('should recive user by token', async () => {
        

        const res = await client.query({
            query: gql`
                query {       
                getUserByToken {
                    email
                    firstName
                    lastName
                    phoneNumber
                    purchasedProducts
                    role
                    orders
                    wishlist
                    credentials{
                        source
                        tokenPass
                    }
                    registrationDate
                    address{
                        country
                        city
                        street
                        appartment
                        buildingNumber
                    }
                }
            }
            `,
            context: {
                headers: {
                    token
                }
            }
        })
      
        expect(res.data.getUserByToken).toMatchSnapshot()
    })

    test('should recive user by id', async () => {

        const res = await client.query({
            query: gql`
                query {       
                getUserById(id: "5f089b814cd4341468389160") {
                    email
                    firstName
                    lastName
                    phoneNumber
                    purchasedProducts
                    role
                    orders
                    wishlist
                    credentials{
                        source
                        tokenPass
                    }
                    registrationDate
                    address{
                        country
                        city
                        street
                        appartment
                        buildingNumber
                    }
                }
            }
            `,
            context: {
                headers: {
                    token
                }
            }
        })

        expect(res.data.getUserByToken).toMatchSnapshot()
    })
})