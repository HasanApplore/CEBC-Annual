const crypto = require("crypto");
const path = require("path");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/s3");

// Shared bucket across multiple projects — namespace everything under
// "cebc/uploads/" so this project's files don't collide with others.
const KEY_PREFIX = "cebc/uploads/";

async function uploadBufferToS3(buffer, mimetype, originalname) {
  const ext = path.extname(originalname) || "";
  const key = `${KEY_PREFIX}${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    })
  );

  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = { uploadBufferToS3 };
