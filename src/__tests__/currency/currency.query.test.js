/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const currencyService = require('../../modules/currency/currency.service')
const currencyResolver = require('../../modules/currency/currency.resolver')
const client = require('../../utils/apolloClient');

require('dotenv').config();


describe('querries', () => {
    test('should recive all currencies like in service and resolver', async () => {
        const res = await client.query({
            query: gql`
                query {       
                    getAllCurrencies {
                        date
                        convertOptions {
                            name
                            exchangeRate
                        }
                    }
                }
            `
        }).then(res => res)
        .catch(err => err)

        expect(currencyService.getAllCurrencies()).resolves.toBe(res);
        expect(currencyResolver.currencyQuery.getAllCurrencies()).resolves.toBe(res);
    })

    test('should recive currencies by id like in service and resolver', async () => {
      const res = await client.query({
          query: gql`
              query {       
                getCurrencyById(id: "5f0462f514438544ec76a77b"){
                    date
                    convertOptions {
                        name
                        exchangeRate
                    }
                }
              }
          `
      }).then(res => res)
      .catch(err => err)

      expect(currencyService.getCurrencyById("5f0462f514438544ec76a77b")).resolves.toBe(res);
      expect(currencyResolver.currencyQuery.getCurrencyById('',{id:"5f0462f514438544ec76a77b"})).resolves.toBe(res);
      expect(res.data.getCurrencyById).toMatchSnapshot()
  })
})