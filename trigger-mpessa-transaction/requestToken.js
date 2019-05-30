const axios = require('axios');

module.exports = getMinBalance;

async function getMinBalance() {
  const url =
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const username = 'EGNo1R6GIosrKdfagkW6xgfJo93ih3QU';
  const password = '4ielDAwewP79VkhY';
  // TODO change when we have different logic for ids

  let response = await axios.get(url, {
    auth: {
      username: username,
      password: password
    }
  });
  console.log(response);
  return response.data.access_token;
}
