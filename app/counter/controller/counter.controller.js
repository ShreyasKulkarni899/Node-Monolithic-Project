const Counter = require("../models/counterSchema.js");
// const responseCode = require('../helper/responseCode');
// const { DUPLICATE } = require('../helper/responseCode');

//Create and Save a new Counter
exports.create = (req, res) => {
  //console.log("IN CReate");
  reqData = req.body;
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Fields cannot be empty!" });
    return;
  }

  Counter.find({
    _id: { $regex: new RegExp("^" + reqData._id.toLowerCase() + "$", "i") },
  })
    .then((result) => {
      if (result.length > 0) {
        res.status(500).json({ message: "Duplicate Entry" });
      } else {
        const newCounter = Counter(req.body);
        newCounter
          .save()
          .then((result) => {
            console.log(result);
            res.status(200).json(result);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

// Find by id and update counter
exports.getNextValue = (req, res) => {
  var sequenceName = req.body._id;
  let data = 0;
  Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { counter: 1 } },
    { new: true, upsert: true },
    (err, result) => {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        data = result;
        //console.log("infunction" + JSON.stringify(result));
        // console.log("infunction_data"+ JSON.stringify(data));
        res.json(data);
      }
    }
  );
  console.log(data);
};

exports.getCurrentValue = (req, res) => {
  var sequenceName = req.query.sequenceName;
  let data = 0;
  console.log(req.query);
  Counter.findById(sequenceName, (err, result) => {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      data = result;
      console.log("infunction" + JSON.stringify(result));
      // console.log("infunction_data"+ JSON.stringify(data));
      res.json(data);
    }
  });
  console.log(data);
};
