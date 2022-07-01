const mongoose = require('mongoose');
const Joi = require("joi");


function customerValidator() {
    const customerSchema = Joi.object({
        customerId: Joi.string().allow(""),
        personalDetails: Joi.object().keys({
            firstName: Joi.string().allow(""),
            middleName: Joi.string().allow(""),
            lastName: Joi.string().allow(""),
            dateOfBirth: Joi.date().default(Date.now()),
            anniversary: Joi.date().default(Date.now()),
            profession: Joi.string().allow(""),
            maritialStatus: Joi.string().allow(""),
            joiningDate: Joi.date().default(Date.now()),
            profileImageUrl: Joi.string().allow(""),
        }),
        addresses: Joi.array().items({
            addressType: Joi.string().allow(""),
            firstLine: Joi.string().allow(""),
            secondLine: Joi.string().allow(""),
            city: Joi.string().allow(""),
            pincode: Joi.string().allow("")
        }).min(1),
        shippingAddress: Joi.array().items({
            addressType: Joi.string().allow(""),
            firstLine: Joi.string().allow(""),
            secondLine: Joi.string().allow(""),
            city: Joi.string().allow(""),
            pincode: Joi.string().allow("")
        }).min(1),

        contacts: Joi.array().items({
            contactType: Joi.string().allow(""),
            phoneNo: Joi.string().allow(""),
            contactPersonName: Joi.string().allow(""),
            relation: Joi.string().allow("")
        }),
        loginDetails: Joi.object().keys({
            custUserName: Joi.string().allow(""),
            email: Joi.string().allow(""),
            phone: Joi.string().allow(""),
            password: Joi.string().allow("")
        }),

        identityDocuments: Joi.array().items({
            idType: Joi.string().allow(""),
            cardNumber: Joi.string().allow(""),
            idUrl: Joi.string().allow("")
        }),
        customerGroup: Joi.boolean().default(false),
        activeStatus: Joi.boolean().default(false),
        asAgentActiveStatus: Joi.boolean().default(false),
        bankDetail: Joi.array().items({
            bankName: Joi.string().allow(""),
            accountNumber: Joi.string().allow(""),
            ifsc: Joi.string().allow(""),
            branch: Joi.string().allow(""),
            narration: Joi.string().allow(""),
        }),
        customerCredit: Joi.object().keys({
            applicableStatus: Joi.boolean().default(false),
            creditLimit: Joi.number().default(0),
            openingBalance: Joi.number().default(0),
            creditDueDays: Joi.number().default(0),
            referredByCustomer: Joi.object().keys({
                customerId: Joi.string().allow(""),
                name: Joi.string().allow(""),
            }),
            referredByEmployee: Joi.object().keys({
                employeeId: Joi.string().allow(""),
                name: Joi.string().allow(""),
            }),
            discountApplicable: Joi.string().allow(""),
            spotBillDiscount: Joi.boolean().default(false),
            discountOnReceipt: Joi.boolean().default(false),
        }),
        customerLoyaltyProgram: Joi.object().keys({
            loyaltyCardActiveStatus: Joi.boolean().default(false),
            loyaltyCardNumber: Joi.string().allow(""),
            enrollmentDate: Joi.date().default(Date.now()),
            loyaltyCardPoints: Joi.number().default(0),
            referredByCustomer: Joi.object().keys({
                customerId: Joi.string().allow(""),
                name: Joi.string().allow(""),
            }),
            referredByEmployee: Joi.object().keys({
                employeeId: Joi.string().allow(""),
                name: Joi.string().allow(""),
            }),
            extraDiscount: Joi.string().allow(""),
            cashBackDiscount: Joi.boolean().default(false),
            spotDiscount: Joi.boolean().default(false),
        }),

    });
    const result = customerSchema.validate();
    return result.error ? result.error.details[0].message : false;
}
//exporting
module.exports = customerValidator;