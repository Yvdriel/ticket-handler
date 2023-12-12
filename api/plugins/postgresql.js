const pgp = require('pg-promise')(/* options */)
const db = pgp(process.env.POSTGRES_URL + "?ssl=true")

module.exports = db;