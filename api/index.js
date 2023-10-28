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
    .post("/posts", body_mapper(req.body))
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.json(error);
    });
});

module.exports = app;
