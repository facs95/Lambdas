require('dotenv').config();
const sendMin = require('./sendMin');
const { initUser } = require('common/User');

const checkErrorThrowing = async params => {
  try {
    await sendMin(params);
  } catch (err) {
    expect(err.message).toBe('Missing parameter');
  }
};

test('should throw an error for missing params', async () => {
  await checkErrorThrowing();
  await checkErrorThrowing({ phoneNumber: '9190000000' });
  await checkErrorThrowing({ countryCode: '1' });
});

test('should sent MIN from admin to recipient', async () => {
  const sender = { countryCode: '0', phoneNumber: '00000' };
  const recipient = { countryCode: '254', phoneNumber: '799532244' };
  const senderUser = await initUser(sender.countryCode, sender.phoneNumber);
  const recipientUser = await initUser(
    recipient.countryCode,
    recipient.phoneNumber
  );
  const senderUserBalance = await senderUser.getBalance();
  const recipientUserBalance = await recipientUser.getBalance();
  // const amountMins = 0.009880461532562144;
  const amountMins = 1;
  const result = await sendMin({
    recipient,
    amountMins
  });
  const newSenderUserBalance = await senderUser.getBalance();
  const newRecipientUserBalance = await recipientUser.getBalance();
  console.log(result);
  expect(newSenderUserBalance).toBe(String(senderUserBalance - amountMins));
  expect(newRecipientUserBalance).toBe(
    String(Number(recipientUserBalance) + amountMins)
  );
}, 500000);

test('should return Insufficient funds error when the amountMins is too big', async () => {
  const recipient = { countryCode: '254', phoneNumber: '799532244' };
  try {
    const result = await sendMin({
      recipient,
      amountMins: 100000000
    });
  } catch (err) {
    expect(err.message).toBe('Insufficient funds');
  }
});
