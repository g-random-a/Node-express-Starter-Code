import {
  PutObjectCommand,
  PutObjectCommandOutput,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import s3Client from '../../config/awsS3/awsS3connect';

interface UploadFileResponse {
  filePath: string;
  bucketName: string;
  response: PutObjectCommandOutput;
}

export const getBucketName = (): string => {
  const environment = process.env.NODE_ENV || 'dev';
  return `question-response-service-${environment}-bucket`;
};

// Helper function to ensure the bucket exists
const ensureBucketExists = async (bucketName: string): Promise<void> => {
  try {
    // Check if the bucket exists
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket '${bucketName}' already exists.`);
  } catch (error: any) {
    // If the bucket does not exist, create it
    if (error.name === 'NotFound' || error.name === 'NoSuchBucket') {
      console.log(`Bucket '${bucketName}' does not exist. Creating...`);
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`Bucket '${bucketName}' created successfully.`);
    } else {
      throw new Error(`Error checking bucket existence: ${error.message}`);
    }
  }
};

export const uploadFileToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  taskId: string,
  userId: string,
  questionId: string,
  inputId: string,
): Promise<UploadFileResponse> => {
  const bucketName = getBucketName();

  // Ensure the bucket exists before uploading
  await ensureBucketExists(bucketName);

  // Generate timestamp
  const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // e.g., 20240617T123045
  const filePath = `${taskId}/${userId}/${questionId}/${inputId}_${timestamp}_${fileName}`;

  // Prepare S3 upload parameters
  const uploadParams = {
    Bucket: bucketName,
    Key: filePath,
    Body: fileBuffer,
  };

  try {
    const response = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`File uploaded successfully to ${bucketName}/${filePath}`);
    return {
      filePath,
      bucketName,
      response,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
