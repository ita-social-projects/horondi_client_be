const mockSignatureValue = 'test|1663775804854|';
const wrongId = 'ddfdf34';

const mockRequestData = (orderNumber, orderStatus) => {
    return {
      body: {
        order_id: orderNumber,
        order_status: orderStatus,
        signature: mockSignatureValue
      }
    }
  };
  const mockResponseData = {
    json: data => { response = data },
    end: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  };

  module.exports = {
    mockSignatureValue,
    wrongId,
    mockRequestData,
    mockResponseData,
  };