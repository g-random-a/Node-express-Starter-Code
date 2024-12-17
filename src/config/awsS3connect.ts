// Import necessary modules from AWS SDK
import { S3Client } from '@aws-sdk/client-s3';
import { config } from './configs';

// Initialize an S3 client with provided credentials
const s3Client = new S3Client({
    region: config.awsRegion, // Specify the AWS region from environment variables
    credentials: {
        accessKeyId: config.awsAccessKeyId, // Access key ID from environment variables
        secretAccessKey: config.awsSecretAccessKey // Secret access key from environment variables
    }
});

// Export folder names for easier reference
exports.awsFolderNames = {
    sub1: 'question-response-sub1',
};

export default s3Client;