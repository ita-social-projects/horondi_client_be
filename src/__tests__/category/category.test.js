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
        }).then(res => res)

        expect(categoryService.getAllCategories()).resolves.toBe(res);

        expect(res.data.getAllCategories).toMatchSnapshot()
    })

    test('should recive category by id like in service and resolver', async () => {
      const res = await client.query({
          query: gql`
              query {       
                getCategoryById(id: "5ef3970c0ab5dd42436dd5c4"){
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
      }).then(res => res)

      expect(categoryService.getCategoryById("5ef3970c0ab5dd42436dd5c4")).resolves.toBe(res);
      expect(categoryResolver.categoryQuery.getCategoryById('',{id:"5ef3970c0ab5dd42436dd5c4"})).resolves.toBe(res);
      expect(res.data.getCategoryById).toMatchSnapshot()
  })
})