/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const patternService = require('../../modules/pattern/pattern.service')
const patternResolver = require('../../modules/pattern/pattern.resolver')
const client = require('../../utils/apolloClient');

require('dotenv').config();


describe('querries', () => {
    test('should recive all patterns like in service and resolver', async () => {
        const res = await client.query({
            query: gql`
                query {       
                    getAllPatterns {
                        _id
                        name{
                            lang
                            value
                        }
                        description{
                            lang
                            value
                        }
                        images{
                            large
                            medium
                            small
                            thumbnail
                        }
                        material
                        handmade
                        available
                    }
                }
            `
        }).then(res => res)
        .catch(err => err)

        expect(patternService.getAllPatterns()).resolves.toBe(res);
        expect(patternResolver.patternQuery.getAllPatterns()).resolves.toBe(res);
    })

    test('should recive pattern by id like in service and resolver', async () => {
      const res = await client.query({
          query: gql`
              query {       
                getPatternById(id: "0c3c7929dd85de268bed4fe8"){
                    _id
                    name{
                        lang
                        value
                    }
                    description{
                        lang
                        value
                    }
                    images{
                        large
                        medium
                        small
                        thumbnail
                    }
                    material
                    handmade
                    available
                }
              }
          `
      }).then(res => res)
      .catch(err => err)

      expect(patternService.getPatternById("0c3c7929dd85de268bed4fe8")).resolves.toBe(res);
      expect(patternResolver.patternQuery.getPatternById('',{id:"0c3c7929dd85de268bed4fe8"})).resolves.toBe(res);
      expect(res.data.getPatternById).toMatchSnapshot()
  })
})