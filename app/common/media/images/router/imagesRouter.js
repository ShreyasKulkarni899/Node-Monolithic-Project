var express = require("express");
var router = express.Router();
var multer = require("multer");
var multerS3 = require("multer-s3");
var aws = require("aws-sdk");
var S3 = require("aws-sdk/clients/s3");
const config = require("config");
const imageController = require("../controller/imageController");

const { S3_BUCKET_NAME, S3_BUCKET_REGION, S3_ACCESS_KEY, S3_SECRET_KEY } =
  config.get("S3");

var s3 = new aws.S3({
  apiVersion: "latest",
  region: S3_BUCKET_REGION,
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET_KEY,
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET_NAME,
    acl: "public-read",

    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

//Uploading Multiple Files to aws s3 bucket
router.post("/upload", upload.any(), imageController.create);

module.exports = router;
