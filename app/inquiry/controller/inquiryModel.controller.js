const Inquiry = require("../model/inquirySchema.js");
const { messages } = require("../../common/constant/constant.js");
const { responseCodes } = require("../../common/constant/constant.js");
const counter = require("../../counter/models/counterSchema");
const jsonexport = require("jsonexport");

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

  const inquiry = new Inquiry(req.body);
  // console.log(req.body);
  // Save  token Model In Database
  inquiry
    .save(inquiry)
    .then((data) => {
      counter.findByIdAndUpdate(
        "InquiryNumber",
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

//Update Inquiry
exports.update = (req, res) => {
  //console.log("REq Body Here", req.body);
  if (!req.body) {
    //console.log("Here is the problem")
    return res.status(responseCodes.BAD_REQUEST).send({
      status: "NOK",
      code: responseCodes.BAD_REQUEST,
      message: messages.DATA_MISSING,
    });
  }

  const tokenNumber = req.query.tokenNumber;

  Inquiry.findOneAndUpdate({ tokenNumber: tokenNumber }, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      //console.log("data", data);
      if (!data) {
        res.status(responseCodes.BAD_REQUEST).send({
          status: "NOK",
          code: responseCodes.BAD_REQUEST,
          message: messages.DATA_MISSING,
        });
      } else
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "OK",
          code: responseCodes.SUCCESS_CODE,
          message: messages.SUCCESS_UPDATING_DATA,
          data: data,
        });
    })
    .catch((err) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "NOK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};

// get token

exports.getConditionalParameters = async (req, res) => {
  const params = req.query;
  var condition = params;
  // console.log(condition);
  Inquiry.find(condition)
    .then((data) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "Successful",
        code: responseCodes.SUCCESS_CODE,
        message: messages.DATA_FETCHED,
        data: data.reverse(),
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


// get approved and unapproved
exports.getByQuery = async (req, res) => {
  let from = req.query.from;
  let to = req.query.to;
  let isApproved = req.query.isApproved;

  let condition = "";

  if (from == null) {
    condition = req.query.isApproved;
    console.log('here')
  } else if (isApproved === false) {
    condition = { day: { $gte: from, $lte: to } };
  } else {
    condition = {
      day: { $gte: from, $lte: to },
      isApproved: req.query.isApproved,
    };
  }

  console.log(condition);

  Inquiry.find(condition)
    .then((data) => {
      const isEmpty = Object.keys(data).length === 0;
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
          data: data.reverse(),
        });
      }
      // console.log(data);
    })
    .catch((err) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "failed",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};

// Delete a Token with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Inquiry.findByIdAndRemove(id, { useFindAndModify: false })
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

exports.getCSV = (req, res) => {
  let from = req.query.from;
  let to = req.query.to;
  let isApproved = req.query.isApproved;

  let condition = "";

  if (from === null) {
    condition = req.query;
  } else if (isApproved === false) {
    condition = { day: { $gte: from, $lte: to } };
  } else {
    condition = {
      day: { $gte: from, $lte: to },
      isApproved: req.query.isApproved,
    };
  }

  // console.log(condition);

  Inquiry.find(condition)
    .lean()
    .then((data) => {
      const isEmpty = Object.keys(data).length === 0;
      if (isEmpty) {
        res.status(responseCodes.BAD_REQUEST).send({
          status: "Failed",
          code: responseCodes.BAD_REQUEST,
          message: messages.NO_DATA,
        });
      } else {
        jsonexport(data, function (err, csv) {
          if (err) return console.error(err);
          var filename = "Inquiries_Data_" + Date.now().toString() + ".csv";
          res.setHeader("Content-Type", "text/csv");
          res.setHeader(
            "Content-Disposition",
            `attachment; filename=${filename}`
          );
          res.status(200).send(csv);
        });
      }
      // console.log(data);
    })
    .catch((err) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "Failed",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};
