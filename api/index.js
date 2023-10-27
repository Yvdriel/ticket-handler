const app = require("express")();
const body = require("./body.js");
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

// MIDDLEWARE
app.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

app.get("/api", (req, res) => {
  const path = `/api/item/`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go todf item: <a href="${path}">${path}</a>`);
});

// TESTING FOR TOKEN
app.get("/token", (req, res) => {
  res.end(process.env.API_TOKEN + ' | ' + process.env.API_TOKEN);
});

// TICKET PURCHASE REGISTRATION
app.post("/api/ticket/purchase", jsonParser, (req, res) => {
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    res.json(body);
});

module.exports = app;
