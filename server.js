var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CRATERS_COLLECTION = "craters";

var app = express();
app.use(bodyParser.json());

var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log("Database connection ready");

  var server = app.listen(process.env.PORT || 3001, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ error: message });
}

app.get("/craters", function(req, res) {
  db.collection(CRATERS_COLLECTION)
    .find({})
    .toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get craters.");
      } else {
        res.status(200).json(docs);
      }
    });
});

app.post("/craters", function(req, res) {
  var newCrater = req.body;
  newCrater.createDate = new Date();

  if (!(req.body.zip || req.body.location)) {
    handleError(
      res,
      "Invalid user input",
      "Must provide a first or last name.",
      400
    );
  }

  db.collection(CRATERS_COLLECTION).insertOne(newCrater, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new crater.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/craters/:id"
 *    GET: find crater by id
 *    PUT: update crater by id
 *    DELETE: deletes crater by id
 */

app.get("/craters/:zip", function(req, res) {
  db.collection(CRATERS_COLLECTION).find(
    { zip: new ObjectID(req.params.zip) },
    function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get crater");
      } else {
        res.status(200).json(doc);
      }
    }
  );
});

app.get("/craters/:craterId", function(req, res) {
  db.collection(CRATERS_COLLECTION).findOne(
    { _id: new ObjectID(req.params.craterId) },
    function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get crater");
      } else {
        res.status(200).json(doc);
      }
    }
  );
});

app.delete("/craters/:craterId", function(req, res) {
  db.collection(CRATERS_COLLECTION).deleteOne(
    { _id: new ObjectID(req.params.craterId) },
    function(err, result) {
      if (err) {
        handleError(res, err.message, "Failed to delete crater");
      } else {
        res.status(204).end();
      }
    }
  );
});
