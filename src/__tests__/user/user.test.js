/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const userService = require('../../modules/user/user.service')
const userResolver = require('../../modules/user/user.resolver')
const client = require('../../utils/apolloClient');

require('dotenv').config();


describe('querries', () => {
    test('should recive all users like in service and resolver', async () => {
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
        }).then(res => res)

        expect(userService.getAllUsers()).resolves.toBe(res);
        expect(userResolver.userQuery.getAllUsers()).resolves.toBe(res);
        expect(res.data.getAllUsers).toMatchSnapshot()
    })

//     test('should recive user by id like in service and resolver', async () => {
//       const res = await client.query({
//           query: gql`
//               query {       
//                 getUserById(id: "0c3c7929dd85de268bed4fe8"){
//                     _id
//                     name{
//                         lang
//                         value
//                     }
//                     description{
//                         lang
//                         value
//                     }
//                     images{
//                         large
//                         medium
//                         small
//                         thumbnail
//                     }
//                     material
//                     handmade
//                     available
//                 }
//               }
//           `
//       }).then(res => res)

//       expect(userService.getUserById("0c3c7929dd85de268bed4fe8")).resolves.toBe(res);
//       expect(userResolver.userQuery.getUserById('',{id:"0c3c7929dd85de268bed4fe8"})).resolves.toBe(res);
//       expect(res.data.getUserById).toMatchSnapshot()
//   })
})