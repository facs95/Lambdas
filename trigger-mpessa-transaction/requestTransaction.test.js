const requestTransaction = require('./requestTransaction.js');

test('should generate transaction', async () => {
  const sender = { countryCode: '254', phoneNumber: '799532244' };
  let authToken = 'TMEp5KFIFVRGywmxwLMKXFG4ycBz';
  let amount = 1;
  try {
    const response = await requestTransaction({ sender, authToken, amount });
    expect(response.ResultCode).toBe();
  } catch (err) {
    console.log(err);
  }
});
