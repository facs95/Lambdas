const exchangeUrl = 'http://apilayer.net/api/live';
const exchangeApiKey = '11c2c1a5cbc8b7ead7cdc0904d8cfc40';
const axios = require('axios');

//TODO store it in some config file

module.exports = currencyExchange;

async function currencyExchange() {
  const response = await axios.get(exchangeUrl, {
    params: {
      access_key: exchangeApiKey
    }
  });
  // . Get KES price to USD
  const USDKESPrice = response.data;
  return { status: USDKESPrice };
}
