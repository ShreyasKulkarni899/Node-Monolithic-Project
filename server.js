const express = require("express");
const connectDB = require("./db");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
const app = express();
//const morgan = require("morgan");

var corsOptions = {
  origin: "http://localhost:8080",
};

// app.use(cors(corsOptions));
// app.use(
//   morgan((req, res) => {
//     console.log("Morgan Output", req);
//   })
// );
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

// Database Connection
const db = connectDB;

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome To The App!!" });
});

require("./app/common/routes/app.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
