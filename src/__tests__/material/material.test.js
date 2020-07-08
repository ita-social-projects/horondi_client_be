/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const materialService = require('../../modules/material/material.service')
const materialResolver = require('../../modules/material/material.resolver')
const client = require('../../utils/apolloClient');

require('dotenv').config();


describe('querries', () => {
    test('should recive all materials like in service and resolver', async () => {
        const res = await client.query({
            query: gql`
                query {       
                    getAllMaterials {
                        _id
                        name{
                            lang
                            value
                        }
                        description{
                            lang
                            value
                        }
                        colors{
                            code
                            name{
                                lang
                                value
                            }
                            images{
                                large
                                medium
                                small
                                thumbnail
                            }
                            available
                        }
                        available
                        additionalPrice
                    }
                }
            `
        }).then(res => res)
        .catch(err => err)

        expect(materialService.getAllMaterials()).resolves.toBe(res);
        expect(materialResolver.materialQuery.getAllMaterials()).resolves.toBe(res);
        expect(res.data.getAllMaterials).toMatchSnapshot()
    })

    test('should recive material by id like in service and resolver', async () => {
      const res = await client.query({
          query: gql`
              query {       
                getMaterialById(id: "1d2bba5d0b80938327ac9012"){
                    _id
                        name{
                            lang
                            value
                        }
                        description{
                            lang
                            value
                        }
                        colors{
                            code
                            name{
                                lang
                                value
                            }
                            images{
                                large
                                medium
                                small
                                thumbnail
                            }
                            available
                        }
                        available
                        additionalPrice
                }
              }
          `
      }).then(res => res)
      .catch(err => err)

      expect(materialService.getMaterialById("1d2bba5d0b80938327ac9012")).resolves.toBe(res);
      expect(materialResolver.materialQuery.getMaterialById('',{id:"1d2bba5d0b80938327ac9012"})).resolves.toBe(res);
      expect(res.data.getMaterialById).toMatchSnapshot()
  })
})