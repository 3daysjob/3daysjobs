const { S3Client } = require('@aws-sdk/client-s3');
const config = require('./config');

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://5cc75c91d33bd67a449f63708731ff19.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: '140538e7953399edb268d86365fe8582',
    secretAccessKey: '703c221ae9c1c574299802c565b5089849f1c757fc5304c9a0e8803e9b4744fb',
  },
});

module.exports = r2;
