const body = {
  EventId: process.env.EVENT_ID,
  Email: "contact_email",
  HasAcceptedTermsAndAgreements: true,
  Paid: true,
  PaidDate: "2023-10-27T15:06:33.518Z",
  PurchaseItems: [],
};

module.exports = body;
