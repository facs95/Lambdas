const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const requestToken = require('./requestToken');
const requestTransaction = require('./requestTransaction');

// TODO check secret.key before start

const parseBearerAuthorization = headers => {
  const authHeader = headers.Authorization;
  if (!authHeader) throw new Error('Not authorized');
  const headerParts = authHeader.split(' ');
  if (headerParts[0] === 'Bearer') {
    return headerParts[1];
  }
};

function decodeAuthorization(headers) {
  const token = parseBearerAuthorization(headers);
  return new Promise((resolve, reject) => {
    const cert = fs.readFileSync(path.resolve(__dirname, 'secret.key'));
    jwt.verify(token, cert, function(err, decoded) {
      if (err) {
        reject(err);
      }
      console.debug(decoded);
      resolve(decoded);
    });
  });
}

exports.handler = async event => {
  let statusCode;
  let body;
  const { amount } = event.pathParameters;
  try {
    const tokenData = await decodeAuthorization(event.headers);
    const sender = {
      countryCode: tokenData.countryCode,
      phoneNumber: tokenData.phoneNumber
    };
    const authToken = await requestToken();
    console.log(authToken);
    const transactionResponse = await requestTransaction({
      sender,
      authToken,
      amount
    });
    statusCode = 200;
    body = JSON.stringify({ transactionResponse });
  } catch (err) {
    console.log(err);
    statusCode = 500;
    body = JSON.stringify(err);
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
