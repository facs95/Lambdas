const { parsePhoneNumberFromString } = require('libphonenumber-js');

const sendMin = require('./sendMin');
const currencyExchange = require('./currencyExchange.js');

// TODO check secret.key before start

exports.handler = async event => {
  const data = JSON.parse(event.body);
  let statusCode;
  let body;
  try {
    const request = data.Body.stkCallback;
    console.log(request.ResultCode);
    if (Number(request.ResultCode) == 0) {
      let requestPhoneNumber = request.CallbackMetadata.Item[4].Value;
      requestPhoneNumber = '+' + requestPhoneNumber;
      console.log(requestPhoneNumber);
      let phoneNumber = parsePhoneNumberFromString(
        requestPhoneNumber.toString()
      );
      const countryCode = phoneNumber.countryCallingCode;
      phoneNumber = phoneNumber.nationalNumber;
      const recipient = { countryCode: countryCode, phoneNumber: phoneNumber };
      const amount = request.CallbackMetadata.Item[0].Value;
      console.log(amount);
      const kesPriceResponse = await currencyExchange(amount);
      console.log(kesPriceResponse);
      const kesPrice = kesPriceResponse.status.quotes['USDKES'];
      console.log(kesPrice);
      const amountMins = (Number(amount) / Number(kesPrice)) * 0.01;
      console.log(amountMins);
      const response = await sendMin({ recipient, amountMins });
      statusCode = 200;
      body = JSON.stringify(response);
    } else {
      statusCode = 500;
      console.log(request.ResultDesc);
      body = request.ResultDesc;
    }
  } catch (err) {
    console.log(err);
    statusCode = 500;
    body = JSON.stringify(err.message || err);
  }
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
    },
    body
  };
};
