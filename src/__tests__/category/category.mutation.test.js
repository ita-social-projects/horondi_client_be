/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const categoryService = require('../../modules/category/category.service')
const categoryResolver = require('../../modules/category/category.resolver')
const client = require('../../utils/apolloClient');

require('dotenv').config();

let categoryId

describe('mutations', () => {
    test('should create new category', async () => {
        const res = await client.mutate({ 
            mutation: gql`
                mutation {       
                    addCategory(category: {
                        name: [{
                            lang: "eng",
                            value: "Test"
                        },
                        {
                            lang: "ukr",
                            value: "Тест"
                        }
                        ]
                        categoryCode: "23131"
                        subcategories: [{
                            categoryCode: "22341"
                            name: [{
                                lang: "eng",
                                value: "Test"
                            },
                            {
                                lang: "ukr",
                                value: "Тест"
                            }
                            ]
                            available: true
                        }]
                        available: true
                    }){
                        _id
                        name {
                            lang
                            value
                        }
                        categoryCode
                        subcategories {
                            categoryCode
                            name {
                                lang
                                value
                            }
                            available
                        }
                        available
                    }
                }
            `
        })

        categoryId = res.data.addCategory._id
        
        expect(categoryService.addCategory({
            name: [{
                lang: "eng",
                value: "Test"
            },
            {
                lang: "ukr",
                value: "Тест"
            }
            ],
            categoryCode: "23131",
            subcategories: [{
                categoryCode: "22341",
                name: [{
                    lang: "eng",
                    value: "Test"
                },
                {
                    lang: "ukr",
                    value: "Тест"
                },
                ],
                available: true,
            }],
            available: true
        })).resolves.toBe(res);
        
        expect(categoryResolver.categoryMutation.addCategory('',{ category:{
            name: [{
                lang: "eng",
                value: "Test"
            },
            {
                lang: "ukr",
                value: "Тест"
            }
            ],
            categoryCode: "23131",
            subcategories: [{
                categoryCode: "22341",
                name: [{
                    lang: "eng",
                    value: "Test"
                },
                {
                    lang: "ukr",
                    value: "Тест"
                },
                ],
                available: true,
            }],
            available: true
        }})).resolves.toBe(res);
    })

    test('should update category by id', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation($categoryId: ID!) {       
                    updateCategory(id: $categoryId, category: {
                        name: [{
                            lang: "eng",
                            value: "Test"
                        },
                        {
                            lang: "ukr",
                            value: "Тест"
                        }
                        ],
                    }){
                        _id
                        name {
                            lang
                            value
                        }
                        categoryCode
                        subcategories {
                            categoryCode
                            name {
                                lang
                                value
                            }
                            available
                        }
                        available
                    }
                }
            `,
            variables: {
                categoryId
            }
        })

        expect(categoryService.updateCategory(categoryId, {
            name: [{
                lang: "eng",
                value: "Test"
            },
            {
                lang: "ukr",
                value: "Тест"
            }
            ]
        })).resolves.toBe(res);
        
        expect(categoryResolver.categoryMutation.updateCategory('',{ id: categoryId, category:{
            name: [{
                lang: "eng",
                value: "Test"
            },
            {
                lang: "ukr",
                value: "Тест"
            }
            ]
        }})).resolves.toBe(res);
    })

    test('should delete category', async () => {
        const res = await client.mutate({
            mutation: gql`
                mutation($categoryId: ID!) {       
                    deleteCategory(id: $categoryId) {
                        _id
                    }
                }
            `,
            variables: {
                categoryId
            }
        })

        expect(categoryService.deleteCategory(categoryId)).resolves.toBe(res);
        
        expect(categoryResolver. categoryMutation.deleteCategory('',categoryId)).resolves.toBe(res);

    })
})