const app = require("express")();
const body = require("./body.js");
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

// const { v4 } = require('uuid');

app.get("/api", (req, res) => {
  const path = `/api/item/`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go todf item: <a href="${path}">${path}</a>`);
});

app.post("/api/ticket/purchase", jsonParser, (req, res) => {
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    res.json(body);
});

module.exports = app;
