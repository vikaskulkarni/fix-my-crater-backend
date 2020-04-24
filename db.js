const client = require("mongodb").MongoClient;
let _db;

function initDb(callback) {
  if (_db) {
    console.warn("Trying to init DB again!");
    return callback(null, _db);
  }
  client.connect(process.env.MONGODB_URI, connected);
  function connected(err, db) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    _db = db;
    console.log("Database connection ready");
    return callback(null, _db);
  }
}

function getDb() {
  return _db;
}

module.exports = {
  getDb,
  initDb
};
