const Logger = require("../model/LoggerSchema.js");
exports.createLog = async (data) => {
  try {
    const logger = new Logger(data);
    logger
      .save(logger)
      .then(() => {
        //console.log("Data Logged Successfully");
      })
      .catch(() => {
        // console.log("Data Logging Unsuccessful!");
      });
  } catch (e) {
    //console.log("Data Logging Unsuccessful!");
  }
};
