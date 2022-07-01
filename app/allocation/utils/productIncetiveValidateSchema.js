const Joi = require("joi");

module.exports = (data) => {
    const JoiSchema = Joi.object({

        documentType: Joi.string().required(),
        department: Joi.string().required(),
        productItem: Joi.string().required(),
        productType: Joi.string().required(),
        brand: Joi.string().required(),
        sectionSection: Joi.string().required(),
        counterIncentive: Joi.string().required(),
        extraDiscAllowed: Joi.string().required(),
        cashierIncentive: Joi.string().required(),
        operatorIncentive: Joi.string().required(),
        sorterIncentive: Joi.string().required(),
        labelerIncentive: Joi.string().required(),
        incentiveType: Joi.string().required(),
        // regular
        // seasoal

        incentiveCalculationType: Joi.string().required(),
        // percet
        // fixed
        // default

        incentive: Joi.number().required(),


    });

    const result = JoiSchema.validate(data);
    //console.log(result.error);
    return result.error ? result.error.details[0].message : false;
};