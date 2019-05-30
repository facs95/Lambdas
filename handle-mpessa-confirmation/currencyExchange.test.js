require('dotenv').config();
const currencyExchange = require('./currencyExchange');

test('should return USDKES price', async () => {
  const response = await currencyExchange();
  expect(response.status.success).toBe(true);
});
