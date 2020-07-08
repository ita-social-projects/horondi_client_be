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
        }).then(res => {
            return res;
        })
        .catch(error => {
          console.log(error)
        });

        expect(userService.getAllUsers()).resolves.toBe(res);
        expect(userResolver.userQuery.getAllUsers()).resolves.toBe(res);
        expect(res.data.getAllUsers).toMatchSnapshot()
    })

//     test('should recive user by id like in service and resolver', async () => {
//       const res = await client.query({
//           query: gql`
//               query {       
//                 getUserByToken{ 
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
//           `,
//           context: {
//             headers: {
//                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWZjYWY3MWU2MWYwYjQ3MDA4NzA2MTIiLCJlbWFpbCI6InRhY2prYTM0QGdtYWlsLmNvbSIsImlhdCI6MTU5NDIyMjY3MywiZXhwIjoxNTk0MjI2MjczfQ.ECGiqT1ubWP6UWe3hbpH57-USJUvlw25-ZFNhz4NOZ8"
//             }
//           }
//     }).then(res => res)
//     .catch(err => err)

//     console.log(res)
      
//     //   expect(userService.getUserByToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWZjYWY3MWU2MWYwYjQ3MDA4NzA2MTIiLCJlbWFpbCI6InRhY2prYTM0QGdtYWlsLmNvbSIsImlhdCI6MTU5NDIxOTMxNSwiZXhwIjoxNTk0MjIyOTE1fQ.f2RbXNM0HN7sgjrDwcUgN5edT2m6QV5590EnyKPKbic")).resolves.toBe(res);
//     //   expect(userResolver.userQuery.getUserById('','',{headers:{
//     //       token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWZjYWY3MWU2MWYwYjQ3MDA4NzA2MTIiLCJlbWFpbCI6InRhY2prYTM0QGdtYWlsLmNvbSIsImlhdCI6MTU5NDIxOTMxNSwiZXhwIjoxNTk0MjIyOTE1fQ.f2RbXNM0HN7sgjrDwcUgN5edT2m6QV5590EnyKPKbic"
//     //   }})).resolves.toBe(res);
//     //   expect(res.data.getUserById).toMatchSnapshot()
//   })
})