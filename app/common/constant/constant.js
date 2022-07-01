exports.messages = {
  REGISTER_SUCCESS: "Customer registered successfully",
  CUSTOMER_REGISTER_SUCCESS: "Customer registered successfully",
  CUSTOMER_ADDEDD_SUCCESS: "Customer added successfully",
  CUSTOMER_DELETED_BY_ADMIN: "This customer deleted by admin",

  CUSTOMER_NOT_REGISTER:
    "This customer not exist in our database, please contact to Admin",
  CUSTOMER_ALREADY_REGISTER: "Customer already registered",

  CUSTOMER_UPDATE_SUCCESS: "Customer updated successfully",
  CustomerNotFound: "Customer not found in DataBase, please contact to admin",
  CustomerFound: "Customer found",
  UserFound: "USER ALREADY PRESENT!!",
  CUSTOMER_DELETED_SUCCESS: "Customer deleted successfully",
  CUSTOMER_ALREADY_DELETED: "Customer already deleted",
  CUSTOMER_ID_REQUIRED: "Only customer ID required",
  CUSTOMER_ACTIVATED: "Customer has been activated",
  CUSTOMER_DEACTIVATED: "Customer has been deactivated",
  CUSTOMER_DEACTIVE: "Customer is deactive, please contact to Admin",
  CUSTOMER_DELETED: "Your account is deleted, please contact to Admin",

  ERROR_IN_CODE: "Something went wrong",
  EMAIL_EXIST: "Please enter a valid email address.",
  SECURITY_ANS: "Security answer did not matched.",
  LOGIN_SUCCESS: "Logged in Sucessfully",
  INVALID: "Invalid username or password.",
  INVALID_CREDENTIALS: "Invalid credentials.",

  QUESTION_FETCHED: "Security question fetched successfully",
  TOKEN_NOT_VALID: "Session expired! Please Login Again!",
  AUTH_TOKEN_MISSING: "UnAuthorised Access!",
  NO_DATA: "No data found",
  EMAIL_NOT_EXIST: "Email does not exist",

  SEC_ANSWER: "Please provide security question answer.",
  INVALID_PAS_ANSWER: "Old password or security answer did not match",

  PASSWORD_REQUIRED: "password is required",
  NEW_PASSWORD_REQUIRED: "New password is required",
  CONFIRM_PASSWORD_REQUIRED: "Confirm password is required",
  OLD_PASSOWRD_UNMATCH: "Old password did not match",
  PASS_UPDATED: "Password has been updated successfully",
  PASSWORD_UNMATCHED: "New password and confirm password did not matched",
  PRIOR_5_PASSWORD:
    "Please select a different password other than your previous 5 passwords",
  PASSWORD_WRONG: "invalid password",
  UNMATCHED_PASSWORD: "Password did not matched",
  INCORRECT_OLD_PASSWORD: "Incorrect old password",

  NEW_RESOURCE_CREATED: "Data saved in the collection successfully.",
  SUCCESS_RETRIVING_DATA: "Data retreived successfully from the collection",
  SUCCESS_UPDATING_DATA: "Data updated successfully to the collection",
  SUCCESS_DELETING_DATA:
    "Data collections deleted successfully from the collection",
  CANT_BE_SAME: "New password can't be same as current password",
  PASS_REGEX:
    "Your password must have at least 8 characters with at least one upper case letter, at least one lower case letter and at least one number or special character.",
  INVALID_PASSWORD: "Invalid password",
  MAIL_GUN_ERROR: "Something went wrong with email",
  QUOTE_VARIATION: "Quote value already exist",
  PHONE_REQUIRED: "Phone is Required",
  GENDER_REQUIRED: "Gender is Required",

  NAME_REQUIRED: "Both FirstName and LastName required",

  PROBLEM_IN_DATA: "There is problem in data, please try after some time.",
  INVALID_ACCESS_CODE: "Invalid access code",
  ACCESS_CODE_UNAVAILABLE: "No access code available",
  EMAIL_REQUIRED: "Email is required",
  FORGET_PASS_LINK: "Password reset link sent on your email successfully!",
  TOKEN: "Token is required",
  EXP: "Token expired",
  Broker_NotExist: "Broker did not exist,can't send email",
  INT_NotExist: "Intermediary customer did not exist,can't send email",

  EXCEEDED:
    "Your have exceeded your maixmum login attempts. Please try again later",
  EMAIL_ALREADY_REGISTER: "This email already register with us",
  PHONE_ALREADY_REGISTER: "This phone number already register with us",

  OTP_MATCHED: "OTP Matched! Login Sucessful",
  OTP_SENT: "OTP Sent Successfully",
  OTP_RESENT: "OTP Sent Again Successfully",
  OTP_NOT_MATCHED: "OTP not Matched !",
  LOGIN_SUCCESS: "Enter 6 digits code sent to your registered email.",
  NO_DATA_RECEIVED: "NO data recieved",
  OTP_EXPIRED: "OTP expired",
  DATA_SAVE: "Data saved successfully",
  FORGET_PASS_LINK_EXP: "Forget password link expired",

  // ID

  ID_REQUIRED: "Id required",
  NO_ID_FOUND: "No data with this ID",

  // Groups quote message

  NO_DISCOUNT: "No discount available",
  NO_DICOUNT_SPOUSE: "No discount available for spouse",

  QUOTE: "Quote generated",
  GUEST_QUOTE:
    "Thank you for showing interest in Medipartner, someone will get back to you soon.",
  PREMIUM: "No premium available",
  INS_AGE: "Age didnt come under insurance",
  INS_AGE_SPOUSE: "Spouse Age didnt come under insurance",
  DATA_MISSING: "Please fill in all required fields",
  PROVIDE_ENT: "Please provide entries",
  DATA_FETCHED: "Data fetched successfully",
  NO_DATA: "No record found!",
  TOKEN_MISSING: "No token provided",
  EMAIL_SENT: "Amemded successfully and email sent",
  RECORD_UPDATE: "Record updated !",
  FAILED_UPDATE: "Failed to update",
  SOMETHING_WENT_WRONG: "Something went Wrong, please try again",
  TOKEN_GENERATED: "Token Generated Successfully",
  TRANSPORT_CODE_PRESENT: "This transport code is present in the databse",
  NO_VALID_DATA: "No input data provided!",
  DEPENDENCY_FOUND: "Dependencies found, delete subsequent details!",
  DATE_ERROR: "Parcel received date cannot be early than order date!",
};

exports.responseCodes = {
  //to be used when no new record is inserted but to display success message
  SUCCESS_CODE: 200,

  //to be used when new record is inserted
  NEW_RESOURCE_CREATED: 201,

  //to be used if database query return empty record
  NO_CONTENT: 204,

  //to be used if the request is bad e.g. if we pass record id which does not exits
  BAD_REQUEST: 400,

  //"jwtTokenExpired": 401,
  //to be used when the user is not authorized to access the API e.g. invalid access token
  UNAUTORISED_USER: 401,

  //to be used when access token is not valid
  FORBIDDEN: 403,
  //to be used if something went wrong
  FAILURE_CODE: 404,
  //to be used when error occured while accessing the API
  INTERNAL_SERVER_ERROR: 500,
  //to be used if record already axists
  CONFLICT_CODE: 409,

  VALIDATE_FAIL: 422,
};

exports.prefixArrays = {
  prefixes: [
    "",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
  months: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
};
