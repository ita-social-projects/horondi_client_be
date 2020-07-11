/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const userService = require('../../modules/user/user.service')
const userResolver = require('../../modules/user/user.resolver')
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
        
        expect(userService.registerUser({
            firstName: "Petro", 
            lastName: "Tatsenyak",
            email: "tacjka34@gmail.com",
            password: "12345678Pt"
        })).resolves.toBe(res);
        
        expect(userResolver.userMutation.registerUser('',{ user:{
            firstName: "Petro",
            lastName: "Tatsenyak",
            email: "tacjka34@gmail.com",
            password: "12345678Pt"
        }})).resolves.toBe(res);
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

        token = res.data.loginUser.token

        expect(userService.loginUser({
            email: "tacjka34@gmail.com",
            password: "12345678Pt"
        })).resolves.toBe(res);
        
        expect(userResolver.userMutation.loginUser('',{ user:{
            email: "tacjka34@gmail.com",
            password: "12345678Pt"
        }})).resolves.toBe(res);
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

        expect(userService.updateUserById({
                firstName: "Updated",
        },userId)).resolves.toBe(res);
        
        expect(userResolver.userMutation.updateUserById(null,{ id: userId, user:{
            firstName: "Updated",
        }}, { user: { _id: userId } })).resolves.toBe(res);
    })

    test('should update user by token', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation {       
                    updateUserByToken(user: {
                        firstName: "Updated",
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

        expect(userService.updateUserByToken({
                firstName: "Updated",
        },res.data.updateUserByToken)).resolves.toBe(res);
        
        expect(userResolver.userMutation.updateUserByToken(null,{ user:{
            firstName: "Updated",
        }}, { user: res.data.updateUserByToken })).resolves.toBe(res);
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

        expect(userService.deleteUser(userId)).resolves.toBe(res);
        
        expect(userResolver.userMutation.deleteUser('',userId)).resolves.toBe(res);

    })
})