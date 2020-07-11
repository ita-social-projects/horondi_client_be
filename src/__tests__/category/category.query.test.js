/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const categoryService = require('../../modules/category/category.service')
const categoryResolver = require('../../modules/category/category.resolver')
const client = require('../../utils/apolloClient');

require('dotenv').config();


describe('querries', () => {
    test('should recive all categories like in service and resolver', async () => {
        const res = await client.query({
            query: gql`
                query {       
                    getAllCategories {
                        available
                        name {
                            value
                            lang
                        }
                        categoryCode
                        images {
                            large
                            medium
                            small
                            thumbnail
                        }
                    }
                }
            `
        })

        expect(categoryService.getAllCategories()).resolves.toBe(res);
    })

    test('should recive category by id like in service and resolver', async () => {
      const res = await client.query({
          query: gql`
              query {       
                getCategoryById(id: "5f0462f414438544ec76a778"){
                  _id
                  name {
                    value
                    lang
                  }
                  categoryCode
                  images {
                    large
                    medium
                    small
                    thumbnail
                  }
                }
              }
          `
      })

      expect(categoryService.getCategoryById("5f0462f414438544ec76a778")).resolves.toBe(res);
      expect(categoryResolver.categoryQuery.getCategoryById('',{id:"5f0462f414438544ec76a778"})).resolves.toBe(res);
      expect(res.data.getCategoryById).toMatchSnapshot()
  })
})