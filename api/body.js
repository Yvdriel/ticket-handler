const body = {
  EventId: process.env.EVENT_ID,
  Email: "contact_email",
  HasAcceptedTermsAndAgreements: true,
  PurchaseItems: [],
};

module.exports = body;
