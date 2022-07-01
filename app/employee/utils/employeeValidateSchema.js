const Joi = require("joi");

module.exports = (data) => {
    const JoiSchema = Joi.object({
        // storeid: Joi.string(),
        employeeid: Joi.string().allow(""),
        personalDetails: Joi.object().keys({
            firstName: Joi.string().allow(""),
            middleName: Joi.string().allow(""),
            lastName: Joi.string().allow(""),
            joiningDate: Joi.date().default(Date.now()),
            dateOfBirth: Joi.date().default(Date.now()),
            domicile: Joi.string().allow(""),
            maritialStatus: Joi.string().allow(""),
            numberOfDependents: Joi.string().default(0),
            anniversary: Joi.date().default(Date.now()),
            profileimage: Joi.object().allow(null),
        }),

        addresses: Joi.array()
            .items({
                addressType: Joi.string().allow(""),
                firstLine: Joi.string().allow(""),
                secondLine: Joi.string().allow(""),
                city: Joi.string().allow(""),
                state: Joi.string().allow(""),
                pincode: Joi.string().allow(""),
            })
            .min(1),

        contacts: Joi.array()
            .items({
                contactsType: Joi.string().allow(""),
                phoneNo: Joi.string().allow(""),
                contactPersonName: Joi.string().allow(""),
                relation: Joi.string().allow(""),
            })
            .min(2),

        education: Joi.array().items({
            educationType: Joi.string().allow(""),
            qualification: Joi.string().allow(""),
            specification: Joi.string().allow(""),
            institute: Joi.string().allow(""),
            yearOfPassing: Joi.string().allow(""),
            certficateUrl: Joi.string().allow(""),
        }),

        workExperience: Joi.array().items({
            companyName: Joi.string().allow(""),
            position: Joi.string().allow(""),
            yearsOfExperience: Joi.string().allow(""),
            reference: Joi.string().allow(""),
            referenceContact: Joi.string().allow(""),
        }),

        identity: Joi.array().items({
            idType: Joi.string().allow(""),
            cardNumber: Joi.string().allow(""),
            idUrl: Joi.object().allow(null),
        }),

        referral: Joi.array().items({
            referralType: Joi.string().allow(""),
            name: Joi.string().allow(""),
            nameOther: Joi.string().allow(""),
            id: Joi.string().allow(""),
            contact: Joi.string().allow(""),
            referralIdUrl: Joi.string().allow(""),
            idUrl: Joi.object().allow(null),
        }),

        workDetails: Joi.object().keys({
            position: Joi.string().allow(""),
            department: Joi.string().allow(""),
            section: Joi.string().allow(""),
            // shift: Joi.string(),
            salary: Joi.string().allow(""),
            salaryType: Joi.string().allow(""),
            hiredBy: Joi.string().allow(""),
        }),

        apraisal: Joi.array().items({
            position: Joi.string().allow(""),
            department: Joi.string().allow(""),
            section: Joi.string().allow(""),
            salary: Joi.string().allow(""),
            salaryType: Joi.string().allow(""),
            fromDate: Joi.date().default(Date.now()),
            toDate: Joi.date().default(Date.now()),
            rating: Joi.string().allow(""),
            incrementType: Joi.string().allow(""),
            incrementAmount: Joi.string().allow(""),
        }),

        employeeReferralincentive: Joi.object().keys({
            amount: Joi.string().allow(""),
            duration: Joi.string().allow(""),
            employee1: Joi.string().allow(""),
            employee2: Joi.string().allow(""), //mismatch
        }),

        loginDetails: Joi.object().keys({
            empUserName: Joi.string().allow(""),
            email: Joi.string().allow(""),
            phone: Joi.string().allow(""),
            password: Joi.string().allow(""),
        }),

        customerReferralincentive: {
            amount: Joi.string().allow(""),
            coins: Joi.string().allow(""),
            customer1: Joi.string().allow(""),
            customer2: Joi.string().allow(""),
        },
        sectionHeadId: Joi.string().allow(""),
        productIncentive: {
            amount: Joi.string().allow(""),
        },

        moduleAccessList: Joi.array().items(Joi.string()),
        onduty: Joi.boolean().default(false),
    }).options({ abortEarly: false });

    var result = JoiSchema.validate(data);
    return result.error ? result.error.details[0].message : false;
};