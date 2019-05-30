const { initUser } = require('common/User');
const { log } = require('common/logger');
const { send: sendSmsNotification } = require('./sms-notification');
//TODO store it in some config file
const FON_BNK_UI_LINK =
  'http://fonbnk-ui-react.s3-website.us-east-2.amazonaws.com/';

module.exports = send;

function throwError() {
  throw new Error('Missing parameter');
}

async function send(params = {}) {
  const {
    recipient: {
      countryCode: recipientCountryCode = throwError(),
      phoneNumber: recipientPhoneNumber = throwError()
    } = throwError(),
    amountMins
  } = params;

  // . Get sender user account
  const senderAdmin = await initUser('0', '00000');

  // . Get recipient User account
  const recipientUser = await initUser(
    recipientCountryCode,
    recipientPhoneNumber
  );
  // . Get recipient user account
  // . Check if the user has enough MIN
  // .. Check if it's a new account or old to send a text message
  const adminBalance = await senderAdmin.getBalance();
  let result;
  const amount = Math.ceil(amountMins);
  console.log('sender balance', adminBalance);
  console.log('amount', amount);
  if (Number(adminBalance) >= Number(amount)) {
    const recipientAccount = await recipientUser.getAccount();
    // . Create a MIN transaction
    result = await senderAdmin.send(recipientAccount, amount);
    log(
      `trxHash: ${result.transactionHash}` +
        ` from: ${result.from}` +
        ` to: ${result.to}` +
        ` status: ${result.status}`
    );
    await notifyUser(recipientCountryCode, recipientPhoneNumber, amount);
    // .. Send a notification to user that he received MIN
  } else {
    throw new Error('Insufficient funds');
  }
  return { status: result.status };
}

async function notifyUser(countryCode, phoneNumber, amount) {
  try {
    const completePhoneNumber = `+${countryCode}${phoneNumber}`;
    const text =
      `FonBnk: You have been credited ${amount} MIN. ` +
      `Click the following link to make use of them in FonBnk app. ` +
      FON_BNK_UI_LINK;
    await sendSmsNotification(completePhoneNumber, text);
    console.log(
      `${completePhoneNumber} has been notified about MIN transaction.`
    );
  } catch (err) {
    console.error('SMS notification failed');
    console.error(err);
  }
}
