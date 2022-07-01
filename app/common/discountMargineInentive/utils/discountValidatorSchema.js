const Joi = require('joi');

module.exports = (data) => {
    const JoiSchema = Joi.object({
        documentType: Joi.string(),
        // discount
        // margin
        // incentive
        department: Joi.string(),
        productItem: Joi.string(),
        productType: Joi.string(),
        brand: Joi.string(),
        section: Joi.string(),
        counter: Joi.string(),
        season: Joi.string(),
        purchaseRateMin: Joi.number(),
        purchaseRateMax: Joi.number(),
        saleRateMin: Joi.number(),
        saleRateMax: Joi.number(),
        marginType: Joi.string(),
        // fixed
        // percent

        marginValue: Joi.number(),
        discountType: Joi.string(),
        // regular
        // seasonal
        // special
        // quatity

        discountCalculatinType: Joi.string(),
        // percet
        // fixed

        discount: Joi.number(),
        // positionId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees' },

        workType: Joi.string(),
        // store
        // department 
        // section
        // counter
        // cashier
        // operator
        // labeler
        // sales
        // agent
        // sorter

        incentiveType: Joi.string(),
        // regular
        // seasoal

        incentiveCalculationType: Joi.string(),
        // percet
        // fixed
        // default

        incentive: Joi.number(),
        discountStartDate: Joi.date(),
        discountEndDate: Joi.date()
    });
    //.options({ abortEarly: false })
    var result = JoiSchema.validate(data);
    return result.error ? result.error.details[0].message : false;
}