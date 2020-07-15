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
        })

        expect(userService.getAllUsers()).resolves.toBe(res);
        expect(userResolver.userQuery.getAllUsers()).resolves.toBe(res);

    })

    test('should recive user by token like in service and resolver', async () => {
        const token = await client.mutate({
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
        }).then(res => res.data.loginUser.token)

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
      
        expect(userResolver.userQuery.getUserByToken(null, null,{user:{
            _id: res.data.getUserByToken._id
        }})).resolves.toBe(res);
        expect(res.data.getUserByToken).toMatchSnapshot()
    })

    test('should recive user by id like in service and resolver', async () => {
        const token = await client.mutate({
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
        }).then(res => res.data.loginUser.token)

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
      
        expect(userResolver.userQuery.getUserByToken(null, null,{user:{
            _id: "5f089b814cd4341468389160"
        }})).resolves.toBe(res);
        expect(res.data.getUserByToken).toMatchSnapshot()
    })
})