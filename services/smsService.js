
const TeleSignSDK = require('telesignsdk');

const customerId = process.env.TELESIGN_CUSTOMER_ID;
const apiKey = process.env.TELESIGN_API_KEY;

const messageType = "ARN";

const client = new TeleSignSDK(customerId, apiKey);

module.exports = {
  client, messageType
}


