const axios = require("axios");

const service = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `${process.env.API_TOKEN}`,
  },
});

module.exports = service;
