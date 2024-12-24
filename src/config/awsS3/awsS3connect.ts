import { S3Client } from '@aws-sdk/client-s3';
import config from '../configs';

const s3Client = new S3Client({
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
});

exports.awsFolderNames = {
  sub1: 'question-response-sub1',
};

export default s3Client;
