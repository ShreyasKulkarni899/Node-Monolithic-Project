const Joi = require('joi');

module.exports = (data) => {
    const JoiSchema = Joi.object({
        title: Joi.string().required(),
        dropdownList: Joi.array().items(Joi.string().allow("")),
        isDeleted: Joi.boolean().required()
    }).options({ abortEarly: false });

    var result = JoiSchema.validate(data);
    return result.error ? result.error.details[0].message : false;
}

