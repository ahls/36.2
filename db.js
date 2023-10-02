/** Database config for database. */


const { Client } = require("pg");
const {DB_URI} = require("./config");


const db = new Client({
  host: "/var/run/postgresql/",
  database: DB_URI,
});
db.connect();


module.exports = db;
