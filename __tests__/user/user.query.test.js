/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-client');

require('dotenv').config();

let token, userId

describe('queries', () => {
    beforeAll(async () => {
        const register = await client.mutate({
            mutation: gql`
                mutation {       
                    registerUser(user: {
                        firstName: "Test" 
                        lastName: "User"
                        email: "test.email@gmail.com"
                        password: "12345678Te"
                    }) {
                        _id
                        firstName
                        lastName
                        email
                        role
                        registrationDate
                        credentials {
                            tokenPass
                        } 
                    }
                }
            `
        })

        userId = register.data.registerUser._id

        const auth = await client.mutate({
            mutation: gql`
                mutation {       
                    loginUser(user: {
                        email: "test.email@gmail.com"
                        password: "12345678Te"
                    }) {
                        token
                    }
                }
            `
        })
        token = auth.data.loginUser.token
    });

    afterAll(async () => {
        await client.mutate({
            mutation: gql`
                mutation($userId: ID!) {       
                    deleteUser(id: $userId) {
                        _id
                    }
                }
            `,
            variables: {
                userId
            }
        })
    });

    test('should recive all users', async () => {
        const res = await client.query({
            query: gql`
                query {       
                    getAllUsers{
                        email
                        firstName
                        lastName
                    }
                }
            `
        })
         expect(res.data.getAllUsers).toContainEqual({
            "firstName": "Test" ,
            "lastName": "User",
            "email": "test.email@gmail.com"
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
                    }
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

        expect(res.data.getUserByToken).toHaveProperty(
            'firstName', 'Test'
        );
        expect(res.data.getUserByToken).toHaveProperty(
            'lastName', 'User'
        );
        expect(res.data.getUserByToken).toHaveProperty(
            'email', 'test.email@gmail.com'
        );
        expect(res.data.getUserByToken).toMatchSnapshot()
    })

    test('should recive user by id', async () => {

        const res = await client.query({
            query: gql`
                query($userId: ID! ) {       
                getUserById(id: $userId) {
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
                    }
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
            },
            variables: {
                userId
            }
        })

        expect(res.data.getUserById).toHaveProperty(
            'firstName', 'Test'
        );
        expect(res.data.getUserById).toHaveProperty(
            'lastName', 'User'
        );
        expect(res.data.getUserById).toHaveProperty(
            'email', 'test.email@gmail.com'
        );
        expect(res.data.getUserByToken).toMatchSnapshot()
    })
})