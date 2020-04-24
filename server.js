require("dotenv").config();
let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");

const initDb = require("./db").initDb;

let app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 3001;

const craters = require("./routes/craters-apis");
app.use("/craters", craters);

const users = require("./routes/users-apis");
app.use("/users", users);

initDb(function(err) {
  app.listen(port, function(err) {
    if (err) {
      throw err;
    }
    console.log("API Up and running on port " + port);
  });
});
