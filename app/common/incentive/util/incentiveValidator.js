const mongoose = require('mongoose');
const Joi = require('joi');

function incentiveValidator() {
    const incentiveSchema = Joi.object({
        productId: Joi.string(),
        employeeId: Joi.string(),
        workType: Joi.string(),
        purchaseId: Joi.string(),
        incentiveAmount: Joi.number(),
        paidStatus: Joi.boolean()
    });
    const result = incentiveSchema.validate();
    return result;
}

//exporting
module.exports = incentiveValidator;