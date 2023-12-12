require("dotenv").config();

const app = require("express")();
const body_mapper = require("./plugins/body_mapper.js");
const bodyParser = require("body-parser");
const service = require("./plugins/axios.js");
const db = require("./plugins/postgresql.js");
const verifyWehbook = require("./plugins/webhook.js");

const jsonParser = bodyParser.json();

// MIDDLEWARE
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(verifyWehbook);

app.get("/api/create-order-table", (req, res) => {
  db.query(
    "CREATE TABLE order_confirmation ( order_number int, confirmed bool )"
  )
    .then((data) => {
      res.json(data.value);
      console.log("DATA:", data.value);
    })
    .catch((error) => {
      res.json(error);
      console.log("ERROR:", error);
    });
  return;
});

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

  findOrder(req, res).then((data) => {
    if (data === true) {
      res.status(200).send("Already confirmed");
      return;
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
        return;
      });
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
      createOrder(req, res);
      return;
    })
    .catch((error) => {});
};

const findOrder = async (req, res) => {
  return db
    .one(
      "SELECT Confirmed FROM order_confirmation WHERE Order_number = $1",
      req.body.order_number
    )
    .then((data) => {
      if (data.confirmed === true) {
        // res.send("already confirmed");
        return data.confirmed;
      }
    })
    .catch((error) => {
      console.log("ERROR:", error);
      return false;
    });
};

const createOrder = (req, res) => {
  db.query(
    "INSERT INTO order_confirmation (Order_number, confirmed) VALUES ($1, true);",
    req.body.order_number
  )
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(error);
    });
  return;
};

module.exports = app;
