/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-client');

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

    test('should throw error User with provided email already exist', async () => {
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
        }).catch(err => err)

        expect(res.graphQLErrors[0].message).toBe('User with provided email already exists') 

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

    test('should throw error User with provided email not found', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation {       
                    loginUser(user: {
                        email: "udernotfound@gmail.com"
                        password: "12345678Pt"
                    }) {
                        _id
                        firstName
                        token
                    }
                }
            `
        }).catch(err => err)

        expect(res.graphQLErrors[0].message).toBe('User with provided email not found') 
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

    test('should throw error user with provided id not found', async () => {
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
                userId: "83ee481820a2056b8e5cc015"
            }
        }).catch(err => err)

        expect(res.graphQLErrors[0].message).toBe('User with provided _id not found') 
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
        
        expect(res.graphQLErrors[0].message).toBe('Unauthorized') 
    })

    test('should throw wrong token Error', async () => {
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
                    token: "eyJ3bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjA4OWI4MTRjZDQzNDE0NjgzODkxNjAiLCJlbWFpbCI6InRhY2prYTMzNEBnbWFpbC5jb20iLCJpYXQiOjE1OTUwMTA4MTMsImV4cCI6MTU5NTAxNDQxM30.FKxZkqO1Jheij7pPHR3I7y9n3BT9_MK2-i4eCYjuivM"
                }
            },
        }).catch(err => err)

        expect(res.networkError.result.errors[0].message).toBe('Context creation failed: Wrong token') 
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