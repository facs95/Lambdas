const axios = require('axios');

async function Convert() {
  let url = 'http://apilayer.net/api/live';

  let apiKey = '11c2c1a5cbc8b7ead7cdc0904d8cfc40';
  let amount = '100';
  let transaction = 'USDKES';
  const response = await axios.get(url, {
    params: {
      access_key: apiKey
    }
  });
  console.log(response.data.quotes[transaction]);
}

Convert();
