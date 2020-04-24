const express = require("express");
const router = express.Router();
const db = require("../db").getDb;
const handleError = require("../common/errors").handleError;
const USERS_COLLECTION = "users";

router.get("/", function(req, res) {
  db()
    .collection(USERS_COLLECTION)
    .find({})
    .toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get users.");
      } else {
        res.status(200).json(docs);
      }
    });
});

router.post("/", function(req, res) {
  let newUser = req.body;
  newUser.createDate = new Date();

  if (!(req.body.zip || req.body.location)) {
    handleError(
      res,
      "Invalid user input",
      "Must provide a first or last name.",
      400
    );
  }

  db()
    .collection(USERS_COLLECTION)
    .insertOne(newUser, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new user.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
});

module.exports = router;
