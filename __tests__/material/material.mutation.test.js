/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const materialService = require('../../modules/material/material.service')
const materialResolver = require('../../modules/material/material.resolver')
const client = require('../../utils/apolloClient');

require('dotenv').config();

let materialId

describe('mutations', () => {
    test('should create new material', async () => {
        const res = await client.mutate({ 
            mutation: gql`
                mutation {       
                    addMaterial(material: {
                        name: [
                            {
                                lang: "eng"
                                value: "Test"
                            }
                            {
                                lang: "ukr"
                                value: "Тест"
                            }
                        ]
                        description: [
                            {
                                lang: "eng"
                                value: "Test Desc"
                            }
                            {
                                lang: "ukr"
                                value: "Тест Опис"
                            }
                        ]
                        additionalPrice: 20.2 
                        available: true
                        colors: { 
                            code: 231
                            name: [
                                {
                                    lang: "eng"
                                    value: "Test"
                                }
                                {
                                    lang: "ukr"
                                    value: "Тест"
                                }
                            ]
                            available: true
                        }
                    }){
                        _id
                        name {
                            lang
                            value
                        }
                        description{
                            lang
                            value
                        }
                        additionalPrice
                        available
                        colors {
                            code
                            available
                        }
                    }
                }
            `
        })

        materialId = res.data.addMaterial._id
        
        expect(materialService.addMaterial({
            name: [
                {
                    lang: "eng",
                    value: "Test"
                },
                {
                    lang: "ukr",
                    value: "Тест"
                }
            ],
            description: [
                {
                    lang: "eng",
                    value: "Test Desc"
                },
                {
                    lang: "ukr",
                    value: "Тест Опис"
                }
            ],
            additionalPrice: 20.2 ,
            available: true,
            colors: { 
                code: 231,
                name: [
                    {
                        lang: "eng",
                        value: "Test"
                    },
                    {
                        lang: "ukr",
                        value: "Тест"
                    },
                ],
                available: true
            }
        })).resolves.toBe(res);
        
        expect(materialResolver.materialMutation.addMaterial('',{ material:{
            name: [
                {
                    lang: "eng",
                    value: "Test"
                },
                {
                    lang: "ukr",
                    value: "Тест"
                }
            ],
            description: [
                {
                    lang: "eng",
                    value: "Test Desc"
                },
                {
                    lang: "ukr",
                    value: "Тест Опис"
                }
            ],
            additionalPrice: 20.2 ,
            available: true,
            colors: { 
                code: 231,
                name: [
                    {
                        lang: "eng",
                        value: "Test"
                    },
                    {
                        lang: "ukr",
                        value: "Тест"
                    },
                ],
                available: true
            }
        }})).resolves.toBe(res);
    })

    test('should update material by id', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation($materialId: ID!) {       
                    updateMaterial(id: $materialId, material: {
                        name: [{
                            lang: "eng"
                            value: "Test Updated"
                        }
                        {
                            lang: "ukr"
                            value: "Тест Обновлений"
                        }
                        ]
                    }){
                        _id
                        name {
                            lang
                            value
                        }
                        description{
                            lang
                            value
                        }
                        additionalPrice
                        available
                        colors {
                            code
                            available
                        }
                    }
                }
            `,
            variables: {
                materialId
            }
        })

        expect(materialService.updateMaterial(materialId, {
            name: [{
                lang: "eng",
                value: "Test Updated"
            },
            {
                lang: "ukr",
                value: "Тест Обновлений"
            }
            ]
        })).resolves.toBe(res);
        
        expect(materialResolver.materialMutation.updateMaterial('',{ id: materialId, material:{
            name: [{
                lang: "eng",
                value: "Test Updated"
            },
            {
                lang: "ukr",
                value: "Тест Обновлений"
            }
            ]
        }})).resolves.toBe(res);
    })

    test('should delete material', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation($materialId: ID!) {       
                    deleteMaterial(id: $materialId) {
                        _id
                    }
                }
            `,
            variables: {
                materialId
            }
        })

        expect(materialService.deleteMaterial(materialId)).resolves.toBe(res);
        
        expect(materialResolver. materialMutation.deleteMaterial('',materialId)).resolves.toBe(res);

    })
})