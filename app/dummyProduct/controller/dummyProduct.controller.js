const dummyProduct = require("../models/dummyProductSchema.js");
const { responseCodes } = require("../../common/constant/constant.js");
const { messages } = require("../../common/constant/constant.js");
const Joi = require("joi");
const mongoose = require("mongoose");
const { aggregate } = require("../models/dummyProductSchema.js");

// Create dummy product
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    req.status(responseCodes.BAD_REQUEST).send({
      status: "failed",
      code: responseCodes.BAD_REQUEST,
      message: messages.DATA_MISSING,
    });
    return;
  }

  var newDummyProd = new dummyProduct(req.body);

  newDummyProd.save(newDummyProd).then((data) => {
    // productParameters
    res.status(responseCodes.SUCCESS_CODE).send({
      status: "OK",
      code: responseCodes.SUCCESS_CODE,
      message: messages.NEW_RESOURCE_CREATED,
      data: data,
    });
  });
};

// update dummy Product
exports.update = (req, res) => {
  // validation
  const id = req.params.id;
  const joiSchema = Joi.object({ _id: Joi.string() });
  const result = joiSchema.validate(req.body._id);
  // delete req.body['_id'];

  dummyProduct
    .findOneAndUpdate(id, req.body, { upsert: false, new: true })
    .then((result) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_UPDATING_DATA,
        data: result,
      });
    })
    .catch((err) => {
      res.status(responseCodes.FAILURE_CODE).send({
        status: "failed",
        code: responseCodes.FAILURE_CODE,
        message: messages.NO_DATA,
      });
    })
    .catch((error) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "failed",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};


exports.search = (req, res) => {
  reqData = req.body;
  var condition = {}
  if (reqData.searchString !== " " && reqData.searchString !== "" && reqData.searchString) {
    condition = { $text: { $search: reqData.searchString } }
  }
  // console.log("Request string: " + JSON.stringify(condition));

  try {
    dummyProduct.find(condition,
      async (err, result) => {
        if (err) throw err;
        if (result) {
          return res.status(responseCodes.SUCCESS_CODE).send({
            status: "OK",
            code: responseCodes.SUCCESS_CODE,
            message: messages.SUCCESS_RETRIVING_DATA,
            data: result,
          });
          //res.json(result);
        } else {
          return res.status(responseCodes.FAILURE_CODE).send({
            status: "NOK",
            code: responseCodes.FAILURE_CODE,
            message: messages.NO_DATA,
          });
          //res.json({ message: "record not found", response_code: 404 });
        }
      }
    );
  } catch (e) {
    console.log("error : " + e);
    return res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
      status: "NOK",
      code: responseCodes.INTERNAL_SERVER_ERROR,
      message: messages.SOMETHING_WENT_WRONG,
    });
    // res.json({
    //   message: "someThing went wrong in Backend",
    //   response_code: 405,
    // });
  }
  // console.log(result);
  // // productParameters
  // res.json(result);
};
exports.findAll = (req, res) => {
  const params = req.query;
  var condition = params;
  //console.log(condition);
  dummyProduct
    .find(condition)
    .then((result) => {
      return res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_RETRIVING_DATA,
        data: result,
      });
    })
    .catch((err) => {
      return res.status(responseCodes.FAILURE_CODE).send({
        status: "failed",
        code: responseCodes.FAILURE_CODE,
        message: messages.NO_DATA,
      });
    });
};

exports.findOne = (req, res) => {
  id = req.params.id;

  dummyProduct
    .findById(id)
    .then((result) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_RETRIVING_DATA,
        data: result,
      });
    })
    .catch((err) => {
      res.status(responseCodes.FAILURE_CODE).send({
        status: "failed",
        code: responseCodes.FAILURE_CODE,
        message: messages.FAILURE_RETRIVING_DATA,
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

// exports.findUnwindOne = (req, res) => {
//     const aggregate = dummyProduct.aggregate([
//         { $project: { createdAt: 0, updatedAt: 0 } },
//         //{ $skip: 25 }
//     ]);
//     dummyProduct.aggregate([{ $match: { _id: mongoose.Types.ObjectId(req.body._id) } }]).
//         unwind('variants').
//         exec((err, result) => {
//             // res.status(responseCodes.SUCCESS_CODE).send({
//             //     status: "OK",
//             //     code: responseCodes.SUCCESS_CODE,
//             //     message: messages.SUCCESS_RETRIVING_DATA,
//             //     data: result
//             // });
//             console.log(result);
//             res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
//                 code: responseCodes.INTERNAL_SERVER_ERROR,
//                 data: result
//             });
//         })
//     // .catch(err => {
//     //     res.status(responseCodes.FAILURE_CODE).send({
//     //         status: "failed",
//     //         code: responseCodes.FAILURE_CODE,
//     //         message: messages.NO_DATA
//     //     });
//     // })
//     // .catch(err => {
//     //     res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
//     //         status: "failed",
//     //         code: responseCodes.INTERNAL_SERVER_ERROR,
//     //         message: messages.SOMETHING_WENT_WRONG
//     //     });
//     // });
// }

exports.delete = (req, res) => {
  const id = req.params.id;
  dummyProduct
    .findByIdAndRemove(id, { useFindAndModify: false })
    .then((result) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_DELETING_DATA,
        data: result,
      });
    })
    .catch((err) => {
      res.status(responseCodes.FAILURE_CODE).send({
        status: "failed",
        code: responseCodes.FAILURE_CODE,
        message: messages.NO_DATA,
      });
    })
    .catch((err) => {
      return res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "failed",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};

exports.deleteAll = (req, res) => {
  dummyProduct
    .deleteMany({})
    .then((data) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_DELETING_DATA,
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
