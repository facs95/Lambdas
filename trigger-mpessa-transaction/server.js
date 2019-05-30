const axios = require('axios');

async function getRequestTransaction() {
  const { format } = require('date-fns');
  const timestamp = format(new Date(), 'YYYYMMDDHHMMSS');
  console.log(timestamp);
}

getRequestTransaction();
