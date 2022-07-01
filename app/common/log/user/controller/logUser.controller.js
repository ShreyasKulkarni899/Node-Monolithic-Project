const logUserHere = require("../models/logUser.js");

//create the user log

exports.create = (data) => {
  //creating logUser
  const logUser = new logUserHere({
    userType: data.userType,
    userName: data.userName,
  });
  // Save logUser In Database
  logUser
    .save(logUser)
    .then((data) => {
      console.log("Logged Successfully!");
    })
    .catch((err) => {
      console.log("Crashed!!");
    });
};
