const body = require("../body.js");

const body_mapper = (request) => {
    console.log(request)
    return body
}

module.exports = body_mapper;