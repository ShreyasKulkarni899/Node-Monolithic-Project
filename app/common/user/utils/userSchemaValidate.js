const Joi = require("joi");
const JoiPassword = require("joi-password");

module.exports = (data) => {
  const JoiSchema = Joi.object({
    userType: Joi.string().required(),
    userName: Joi.string().min(5).max(30).required(),
    userPassword: Joi.string().required(),
    userEmail: Joi.string().email().required(),
    userRole: Joi.string().required(),
  });

  const result = JoiSchema.validate(data);
  return result.error ? false : true;
};
