/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apolloClient');

require('dotenv').config();

let userId, token

describe('mutations', () => {
    test('should register user', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation {       
                    registerUser(user: {
                        firstName: "Petro" 
                        lastName: "Tatsenyak"
                        email: "tacjka34@gmail.com"
                        password: "12345678Pt"
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

        userId = res.data.registerUser._id
        
        expect(res.data.registerUser).toHaveProperty(
            'email', 'tacjka34@gmail.com'
        );

    })

    test('should authorize and recive user token', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation {       
                    loginUser(user: {
                        email: "tacjka34@gmail.com"
                        password: "12345678Pt"
                    }) {
                        _id
                        firstName
                        token
                    }
                }
            `
        })
        
        expect(res.data.loginUser).toHaveProperty('token');
        
        token = res.data.loginUser.token  
    })

    test('should update user by id', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation($userId: ID!) {       
                    updateUserById(user: {
                        firstName: "Updated",
                    }, id: $userId){
                        firstName
                        lastName
                        email
                        role
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

        expect(res.data.updateUserById).toHaveProperty(
            'firstName', 'Updated'
        );
    })

    test('should update user by token', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation {       
                    updateUserByToken(user: {
                        firstName: "UpdatedByToken",
                    }){
                        firstName
                        lastName
                        email
                        role
                    }
                }
            `,
            context: {
                headers: {
                    token
                }
            },
        })
        expect(res.data.updateUserByToken).toHaveProperty(
            'firstName', 'UpdatedByToken'
        );
    })

    test('should throw Unauthorized error', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation {       
                    updateUserByToken(user: {
                        firstName: "UpdatedByToken",
                    }){
                        firstName
                        lastName
                        email
                        role
                    }
                }
            `,

        }).catch(err => err)
        
        expect(res.graphQLErrors).toBeDefined()
    })

    test('should delete user', async () => {
        const res = await client.mutate({
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

        expect(res.data.deleteUser._id).toEqual(userId);

    })
})