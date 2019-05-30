require('dotenv').config();

jest.mock('./sendMin');
jest.mock('./currencyExchange.js');

const sendMin = require('./sendMin');
const currencyExchange = require('./currencyExchange');

const currencyExchangeReturn = {
  status: {
    success: true,
    terms: 'https://currencylayer.com/terms',
    privacy: 'https://currencylayer.com/privacy',
    timestamp: 1558867085,
    source: 'USD',
    quotes: {
      USDAED: 3.673204,
      USDAFN: 80.453504,
      USDALL: 109.170403,
      USDAMD: 478.615041,
      USDANG: 1.871504,
      USDAOA: 328.866504,
      USDARS: 44.990402,
      USDAUD: 1.444041,
      USDKES: 101.250385
    }
  }
};

const { handler } = require('./index');

test('handler should return mock balance for valid token', async () => {
  sendMin.mockReturnValue(0);
  currencyExchange.mockReturnValue(currencyExchangeReturn);
  const event = {
    body: JSON.stringify({
      Body: {
        stkCallback: {
          MerchantRequestID: '1034-305020-1',
          CheckoutRequestID: 'ws_CO_DMZ_487968530_20052019021839619',
          ResultCode: 0,
          ResultDesc: 'Successful Transaction',
          CallbackMetadata: {
            Item: [
              { Name: 'Amount', Value: 1 },
              {},
              {},
              {},
              { Name: 'PhoneNumber', Value: '254799532244' }
            ]
          }
        }
      }
    })
  };
  expect(await handler(event)).toEqual({
    statusCode: 200,
    body: 0,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*'
    }
  });
});

test('handler should return resultDesc for incomplete transaction', async () => {
  sendMin.mockReturnValue(1000);
  currencyExchange.mockReturnValue(currencyExchangeReturn);
  const event = {
    body: JSON.stringify({
      Body: {
        stkCallback: {
          MerchantRequestID: '1033-304592-1',
          CheckoutRequestID: 'ws_CO_DMZ_487967832_20052019021550110',
          ResultCode: 1037,
          ResultDesc: '[STK_CB - ]DS timeout.'
        }
      }
    })
  };
  expect(await handler(event)).toEqual({
    statusCode: 500,
    body: '[STK_CB - ]DS timeout.',
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*'
    }
  });
});
