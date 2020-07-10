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

        expect(userService.getAllUsers()).resolves.toBe(res);
        expect(userResolver.userQuery.getAllUsers()).resolves.toBe(res);

    })

    test('should recive user by token like in service and resolver', async () => {
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
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjA4NWQ4ZWY1YmE5MjM3NmM0NWIwZjgiLCJlbWFpbCI6InRhY2prYTMzNEBnbWFpbC5jb20iLCJpYXQiOjE1OTQzODM3NzIsImV4cCI6MTU5NDM4NzM3Mn0.ROnldc3TPO_pB_ahb3mcXJWpdsg29iejuFvmET4wji4"
            }
          }
    }).then(res => res)
    .catch(err => err)
      
      expect(userResolver.userQuery.getUserByToken(null, null,{user:{
          _id: res.data.getUserByToken._id
      }})).resolves.toBe(res);
      expect(res.data.getUserByToken).toMatchSnapshot()
  })
})