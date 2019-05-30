const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const processServiceSid = process.env.TWILIO_SERVICE_INSTANCE_SID;

exports.send = send;

async function send(phoneNumber, text) {
  const notificationOpts = {
    toBinding: JSON.stringify({
      binding_type: 'sms',
      address: phoneNumber
    }),
    body: text
  };
  return client.notify
    .services(processServiceSid)
    .notifications.create(notificationOpts);
}
