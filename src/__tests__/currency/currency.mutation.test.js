/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const currencyService = require('../../modules/currency/currency.service')
const currencyResolver = require('../../modules/currency/currency.resolver')
const client = require('../../utils/apolloClient');

require('dotenv').config();

let currencyId

describe('mutations', () => {
    test('should create new currency', async () => {
        const res = await client.mutate({ 
            mutation: gql`
                mutation {       
                    addCurrency(currency: {
                        convertOptions: [{
                            name: "us"
                            exchangeRate: 0.9
                        },
                        {
                            name: "eu"
                            exchangeRate: 1.2
                        }
                        ]
                    }){
                        _id
                        date
                        convertOptions {
                            name
                            exchangeRate
                        }
                    }
                }
            `
        }).then(res => res)

        currencyId = res.data.addCurrency._id
        
        expect(currencyService.addCurrency({
            convertOptions: [{
                name: "us",
                exchangeRate: 0.9
            },
            {
                name: "eu",
                exchangeRate: 1.2
            }
            ]
        })).resolves.toBe(res);
        
        expect(currencyResolver.currencyMutation.addCurrency('',{ currency:{
            convertOptions: [{
                name: "us",
                exchangeRate: 0.9
            },
            {
                name: "eu",
                exchangeRate: 1.2
            }
            ]
        }})).resolves.toBe(res);
    })

    test('should update currency by id', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation($currencyId: ID!) {       
                    updateCurrency(id: $currencyId, currency: {
                        convertOptions: [{
                            name: "us"
                            exchangeRate: 0.7
                        },
                        {
                            name: "eu"
                            exchangeRate: 1.54
                        }
                        ]
                    }){
                        _id
                        date
                        convertOptions {
                            name
                            exchangeRate
                        }
                    }
                }
            `,
            variables: {
                currencyId
            }
        }).then(res => res)

        expect(currencyService.updateCurrency(currencyId, {
            convertOptions: [{
                name: "us",
                exchangeRate: 0.7
            },
            {
                name: "eu",
                exchangeRate: 1.54
            }
            ]
        })).resolves.toBe(res);
        
        expect(currencyResolver.currencyMutation.updateCurrency('',{ id: currencyId, currency:{
            convertOptions: [{
                name: "us",
                exchangeRate: 0.7
            },
            {
                name: "eu",
                exchangeRate: 1.54
            }
            ]
        }})).resolves.toBe(res);
    })

    test('should delete currency', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation($currencyId: ID!) {       
                    deleteCurrency(id: $currencyId) {
                        _id
                    }
                }
            `,
            variables: {
                currencyId
            }
        }).then(res => res)

        expect(currencyService.deleteCurrency(currencyId)).resolves.toBe(res);
        
        expect(currencyResolver. currencyMutation.deleteCurrency('',currencyId)).resolves.toBe(res);

    })
})