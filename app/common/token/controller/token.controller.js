const Token = require("../model/tokenSchema.js");
const { messages } = require("../../constant/constant");
const { responseCodes } = require("../../constant/constant");
const counter = require("../../../counter/models/counterSchema");

exports.create = (req, res) => {
  // Validation of request
  if (!req.body) {
    res.status(responseCodes.BAD_REQUEST).send({
      status: "NOK",
      code: responseCodes.BAD_REQUEST,
      message: messages.DATA_MISSING,
    });
    return;
  }

  const token = new Token(req.body);
  // console.log(req.body);
  // Save  token Model In Database
  token
    .save(token)
    .then((data) => {
      counter.findByIdAndUpdate(
        "tokenNumber",
        { $inc: { counter: 1 } },
        { new: true, upsert: true },
        (err, result) => {
          if (err) {
            console.log(err);
            res.json(err);
          } else {
            data = result;
            console.log("infunction" + JSON.stringify(result));
            // console.log("infunction_data"+ JSON.stringify(data));
          }
        }
      );

      res.status(responseCodes.NEW_RESOURCE_CREATED).send({
        status: "OK",
        code: responseCodes.NEW_RESOURCE_CREATED,
        message: messages.NEW_RESOURCE_CREATED,
        data: data,
      });
    })
    .catch((err) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "NOK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
      // console.log(err);
    });
};

// get token

exports.getConditionalParameters = async (req, res) => {
  const params = req.query;
  var condition = params;
  Token.find(condition)
    .then((data) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "Successful",
        code: responseCodes.SUCCESS_CODE,
        message: messages.DATA_FETCHED,
        data: data,
      });
    })
    .catch((err) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "failed",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};

// get by date query
exports.getByDate = async (req, res) => {
  let from = req.query.from;
  let to = req.query.to;

  let condition = { day: { $gte: from, $lte: to } };

  // console.log(condition);

  Token.find(condition)
    .then(data => {
      const isEmpty = Object.keys(data).length === 0
      if (isEmpty) {
        res.status(responseCodes.BAD_REQUEST).send({
          status: "failed",
          code: responseCodes.BAD_REQUEST,
          message: messages.NO_DATA,
        });
      } else {
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "Successful",
          code: responseCodes.SUCCESS_CODE,
          message: messages.DATA_FETCHED,
          data: data
        });
      }
      // console.log(data);
    })
    .catch(err => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "failed",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
}

// Delete a Token with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Token.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(responseCodes.BAD_REQUEST).send({
          status: "NOK",
          code: responseCodes.BAD_REQUEST,
          message: messages.NO_DATA,
        });
      } else {
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "OK",
          code: responseCodes.SUCCESS_CODE,
          message: messages.SUCCESS_DELETING_DATA,
          data: data,
        });
      }
    })
    .catch((err) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "NOK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};
