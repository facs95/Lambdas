const axios = require('axios');
const base64 = require('base-64');
const { format } = require('date-fns');

module.exports = getRequestTransaction;

function throwError() {
  throw new Error('Missing Parameter');
}

async function getRequestTransaction(params = {}) {
  const {
    sender: {
      countryCode: senderCountryCode = throwError(),
      phoneNumber: senderPhoneNumber = throwError()
    } = throwError(),
    authToken,
    amount
  } = params;
  console.log(senderCountryCode);
  console.log(senderPhoneNumber);
  const timestamp = format(new Date(), 'YYYYMMDDHHMMSS');
  const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  const auth = 'Bearer ' + authToken;
  const passKey =
    'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  const shortCode = '174379';
  console.log(timestamp);
  const password = base64.encode(shortCode + passKey + timestamp);
  const response = await axios.post(
    url,
    {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: `${senderCountryCode}${senderPhoneNumber}`,
      PartyB: shortCode,
      PhoneNumber: `${senderCountryCode}${senderPhoneNumber}`,
      CallBackURL:
        'https://oyge46qc3a.execute-api.us-east-2.amazonaws.com/default/handleMpessaConfirmation',
      AccountReference: 'test',
      TransactionDesc: 'test'
    },
    {
      headers: {
        Authorization: auth
      },
      httpsAgent: new https.Agent({ keepAlive: true })
    }
  );
  console.log(response);
  return response.data;
}
