require("dotenv").config();

const app = require("express")();
const body_mapper = require("./plugins/body_mapper.js");
const bodyParser = require("body-parser");
const service = require("./plugins/axios.js");

const jsonParser = bodyParser.json();

// MIDDLEWARE
app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

app.get("/api", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`why are you here`);
});

// TESTING FOR TOKEN
app.get("/api/token", (req, res) => {
  res.end(process.env.API_TOKEN + " | " + process.env.API_URL);
});

// TICKET PURCHASE REGISTRATION
app.post("/api/ticket/purchase", jsonParser, (req, res) => {
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

  service
    .get(process.env.QUEUE_URL + process.env.EVENT_ID)
    .then((response) => {
      setTimeout(
        () => startPurchase(req, res),
        response.data.queueTimeInSeconds ?? 0
      );
    })
    .catch((error) => {
      res.json(error);
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
      res.json(error);
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
    })
    .catch((error) => {
      res.json(error);
    });
};

module.exports = app;
