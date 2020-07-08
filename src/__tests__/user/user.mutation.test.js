/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const userService = require('../../modules/user/user.service')
const userResolver = require('../../modules/user/user.resolver')
const client = require('../../utils/apolloClient');

require('dotenv').config();


describe('mutations', () => {
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
        .catch(err => err)

        expect(userService.loginUser({
            email: "tacjka34@gmail.com",
            password: "12345678Pt"
        })).resolves.toBe(res);
        
        expect(userResolver.userMutation.loginUser('',{ user:{
            email: "tacjka34@gmail.com",
            password: "12345678Pt"
        }})).resolves.toBe(res);
    })
})