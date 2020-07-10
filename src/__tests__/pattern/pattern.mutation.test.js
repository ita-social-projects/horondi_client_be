/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const patternService = require('../../modules/pattern/pattern.service')
const patternResolver = require('../../modules/pattern/pattern.resolver')
const client = require('../../utils/apolloClient');

require('dotenv').config();

let patternId

describe('mutations', () => {
    test('should create new pattern', async () => {
        const res = await client.mutate({ 
            mutation: gql`
                mutation {       
                    addPattern(pattern: {
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
                        material: "Testmaterial"
                        available: true
                        handmade: false
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
                        material
                        available
                        handmade
                    }
                }
            `
        }).then(res => res)

        patternId = res.data.addPattern._id
        
        expect(patternService.addPattern({
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
            material: "Testmaterial",
            available: true,
            handmade: false
        })).resolves.toBe(res);
        
        expect(patternResolver.patternMutation.addPattern('',{ pattern:{
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
            material: "Testmaterial",
            available: true,
            handmade: false
        }})).resolves.toBe(res);
    })

    test('should update pattern by id', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation($patternId: ID!) {       
                    updatePattern(id: $patternId, pattern: {
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
                        material
                        available
                        handmade
                    }
                }
            `,
            variables: {
                patternId
            }
        }).then(res => res)

        expect(patternService.updatePattern(patternId, {
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
        
        expect(patternResolver.patternMutation.updatePattern('',{ id: patternId, pattern:{
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

    test('should delete pattern', async () => {
       

        const res = await client.mutate({
            mutation: gql`
                mutation($patternId: ID!) {       
                    deletePattern(id: $patternId) {
                        _id
                    }
                }
            `,
            variables: {
                patternId
            }
        }).then(res => res)

        expect(patternService.deletePattern(patternId)).resolves.toBe(res);
        
        expect(patternResolver. patternMutation.deletePattern('',patternId)).resolves.toBe(res);

    })
})