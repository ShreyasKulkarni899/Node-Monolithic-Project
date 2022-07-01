const Joi = require("joi");

module.exports = (data) => {
    const JoiSchema = Joi.object({
        department: Joi.string().required(),
        productItem: Joi.string().required(),
        productType: Joi.string().required(),
        brand: Joi.string().required(),
        designNumber: Joi.string().allow(""),
        style: Joi.string().allow(""),
        pattern: Joi.string().allow(""),
        fitting: Joi.string().allow(""),
        fabric: Joi.string().allow(""),
        storeSection: Joi.string().required(),
        warehouseSection: Joi.string().required(),
        counter: Joi.string().required(),
        rackNo: Joi.string().required(),

    });

    const result = JoiSchema.validate(data);
    //console.log(result.error);
    return result.error ? result.error.details[0].message : false;
};