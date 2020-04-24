const express = require("express");
const router = express.Router();
let mongodb = require("mongodb");
let ObjectID = mongodb.ObjectID;
const db = require("../db").getDb;
const handleError = require("../common/errors").handleError;
const CRATERS_COLLECTION = "craters";

router.get("/", function(req, res) {
  db()
    .collection(CRATERS_COLLECTION)
    .find({})
    .toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get craters.");
      } else {
        res.status(200).json(docs);
      }
    });
});

router.post("/", function(req, res) {
  let newCrater = req.body;
  newCrater.createDate = new Date();

  if (!(req.body.zip || req.body.location)) {
    handleError(
      res,
      "Invalid user input",
      "Must provide a first or last name.",
      400
    );
  }

  db()
    .collection(CRATERS_COLLECTION)
    .insertOne(newCrater, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new crater.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
});

router.get("/:zip", function(req, res) {
  db()
    .collection(CRATERS_COLLECTION)
    .find({ zip: new ObjectID(req.params.zip) }, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get crater");
      } else {
        res.status(200).json(doc);
      }
    });
});

router.get("/:craterId", function(req, res) {
  db()
    .collection(CRATERS_COLLECTION)
    .findOne({ _id: new ObjectID(req.params.craterId) }, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get crater");
      } else {
        res.status(200).json(doc);
      }
    });
});

router.delete("/:craterId", function(req, res) {
  db()
    .collection(CRATERS_COLLECTION)
    .deleteOne({ _id: new ObjectID(req.params.craterId) }, function(
      err,
      result
    ) {
      if (err) {
        handleError(res, err.message, "Failed to delete crater");
      } else {
        res.status(204).end();
      }
    });
});

module.exports = router;
