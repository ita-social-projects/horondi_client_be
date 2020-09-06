/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');

require('dotenv').config();

describe("Check basic order query functionality",() => {
    let orderId;
    let orderStatus;
    let ordersUserFirstName;
    let ordersUserLastName;

    beforeAll(() => {
        orderId = 'fce8237dc211989be4a6c4e4'
        orderStatus = 'sent'
        ordersUserFirstName = 'Едгар'
        ordersUserLastName = 'Блажков'
    })

    test('Should return the same result as an input',async () => {
        const result = await client.query({
            query: gql`
                query($id: ID!){
                    getOrderById(id: $id) {
                        ... on Order {
                        status
                        user {
                            firstName
                            lastName
                            }
                        }
                        ... on Error {
                        message
                        statusCode
                        }
                    }
                }
            `,
            variables: {
                id: orderId
            }
        })
        .catch(err => err);

        const {status,user: {firstName,lastName}} = result.data.getOrderById;

        expect(status).toEqual(orderStatus);
        expect(firstName).toEqual(ordersUserFirstName);
        expect(lastName).toEqual(ordersUserLastName);
    });
})