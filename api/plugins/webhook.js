const axios = require("axios");
const crypto = require('crypto');

const verifyWehbook = async (request, response, next) => {
  const hmac = request.get('X-Shopify-Hmac-Sha256');

  try {
    const generated_hash = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(request.rawBody)
      .digest('base64');

    if (generated_hash !== hmac) {
      response.status(401).end("unauthorized");
      return;
    }
  } catch (error) {
    response.status(401).end("Failed to authenticate");
    return;
  }

  console.log("Time: ", Date.now());
  next();
}

module.exports = verifyWehbook;
