const Joi = require("joi");

module.exports = (data) => {
  const JoiSchema = Joi.object({
    docType: Joi.string().allow(""),
    department: Joi.string().allow(""),
    productItem: Joi.string().allow(""),
    productType: Joi.string().allow(""),
    brand: Joi.string().allow(""),
    designNumber: Joi.string().allow(""),
    style: Joi.string().allow(""),
    pattern: Joi.string().allow(""),
    fitting: Joi.string().allow(""),
    fabric: Joi.string().allow(""),
    supplier: Joi.string().allow(""),
    hsnWithGst: Joi.object().keys({
      hsn: Joi.string().allow(""),
      gstPercent: Joi.string().allow(""),
    }),
    status: Joi.boolean().default(true),
    marginType: Joi.string().allow(""),
    marginValue: Joi.number().default(0),
    colour: Joi.string().allow(""),
    sizeType: Joi.string().allow(""),
    sizeDetails: Joi.object().keys({
      size: Joi.number().default(0),
      sizeDescription: Joi.string().allow(""),
    }),
    primaryUnit: Joi.string().allow(""),
    secondaryGroupUnit: Joi.string().allow(""),
    tertiaryGroupUnit: Joi.string().allow(""),
    username: Joi.string().allow(""),
    productMargin: Joi.string().allow(""),
  }).options({ abortEarly: false });

  var result = JoiSchema.validate(data);
  return result.error ? result.error.details[0].message : false;
};
