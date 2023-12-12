require("dotenv").config();

const app = require("express")();
const body_mapper = require("./plugins/body_mapper.js");
const bodyParser = require("body-parser");
const service = require("./plugins/axios.js");

const verifyWehbook = require("./plugins/webhook.js");

const jsonParser = bodyParser.json();

// MIDDLEWARE
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}))
app.use(verifyWehbook);

app.get("/api", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`why are you here`);
  return;
});

// TESTING FOR TOKEN
app.get("/api/token", (req, res) => {
  res.end(process.env.API_TOKEN + " | " + process.env.API_URL);
  return;
});

// TICKET PURCHASE REGISTRATION
app.post("/api/ticket/purchase", jsonParser, (req, res) => {
  if (!res.headersSent) {
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  }

  service
    .get(process.env.QUEUE_URL + process.env.EVENT_ID)
    .then((response) => {
      setTimeout(
        () => startPurchase(req, res),
        response.data.queueTimeInSeconds ?? 0
      );
    })
    .catch((error) => {
      res.status(400).json(error);
      return;
    });
});

const startPurchase = (req, res) => {
  service
    .post(
      `/Purchases?api_token=${process.env.API_TOKEN}`,
      body_mapper(req.body)
    )
    .then((response) => {
      startPayment(response.data, res);
    })
    .catch((error) => {
      res.status(400).json(error);
      return;
    });
};

const startPayment = (purchase, res) => {
  service
    .post(
      `/Purchases(${purchase.Id})/YTP.StartPayment?api_token=${process.env.API_TOKEN}`,
      {
        paymentType: "iDeal",
      }
    )
    .then((response) => {
      res.json(response.data);
      return;
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

module.exports = app;
