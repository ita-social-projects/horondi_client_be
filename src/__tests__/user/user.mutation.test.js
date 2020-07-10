/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const userService = require('../../modules/user/user.service')
const userResolver = require('../../modules/user/user.resolver')
const client = require('../../utils/apolloClient');

require('dotenv').config();

let userId

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
                        id
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
        }).then(res => res)

        userId = res.data.registerUser.id
        
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

        // expect(res.data.registerUser).toMatchSnapshot()
    })

    test('should authorize and recive user token', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation {       
                    loginUser(user: {
                        email: "tacjka34@gmail.com"
                        password: "12345678Pt"
                    }) {
                        token
                    }
                }
            `
        }).then(res => res)

        expect(userService.loginUser({
            email: "tacjka34@gmail.com",
            password: "12345678Pt"
        })).resolves.toBe(res);
        
        expect(userResolver.userMutation.loginUser('',{ user:{
            email: "tacjka34@gmail.com",
            password: "12345678Pt"
        }})).resolves.toBe(res);

        // expect(res.data.loginUser).toMatchSnapshot()
    })

    test('should delete user', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation($userId: ID!) {       
                    deleteUser(id: $userId) {
                        id
                    }
                }
            `,
            variables: {
                userId
            }
        }).then(res => res)

        expect(userService.deleteUser(userId)).resolves.toBe(res);
        
        expect(userResolver.userMutation.deleteUser('',userId)).resolves.toBe(res);

    })
})