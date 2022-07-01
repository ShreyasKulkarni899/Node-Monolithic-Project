const { messages } = require("../../../constant/constant.js");
const { responseCodes } = require("../../../constant/constant.js");
const ImagesSchema = require("../models/imageSchema.js");

exports.create = async (req, res) => {
  try {
    //console.log(req);
    if (!req.body) {
      res.status(responseCodes.BAD_REQUEST).send({
        status: "NOK",
        code: responseCodes.BAD_REQUEST,
        message: messages.DATA_MISSING,
      });
      return;
    }

    let uploadImage = req.files.map((ele) => {
      return {
        //createdBy: req.body.createdBy,
        type: ele.mimetype,
        fileName: ele.originalname,
        filePath: ele.location,
        //moduleType: req.body.moduleType,
      };
    });

    let result = await ImagesSchema.insertMany(uploadImage);
    if (result.length > 0)
      res.status(responseCodes.SUCCESS_CODE).json({
        status: "OK",
        messageID: responseCodes.SUCCESS_CODE,
        message: messages.NEW_RESOURCE_CREATED,
        data: result,
      });
    else {
      res.json({
        status: "NOK",
        messageID: responseCodes.FAILURE_CODE,
        message: messages.ERROR_IN_CODE,
      });
    }
  } catch (e) {
    res.json({
      status: "NOK",
      messageID: responseCodes.FAILURE_CODE,
      message: messages.ERROR_IN_CODE,
    });
  }
};
