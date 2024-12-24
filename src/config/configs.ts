import dotenv from 'dotenv';

dotenv.config();

const config = {
  mongoDbUrl: process.env.MONGO_DB_URI || '',
  port: process.env.PORT || 3000,
  rabbitmqHost: process.env.RABBITMQ_URL || 'localhost',
  rabbitmqQueue: process.env.RABBITMQ_QUEUE || 'platformX',
  rabbitmqUsername: process.env.RABBITMQ_USERNAME || 'annotation_ms',
  rabbitmqPassword: process.env.RABBITMQ_PASSWORD || '11223344',
  rabbitmqPort: Number(process.env.RABBITMQ_PORT) || 5672,
  awsBucketName: process.env.AWS_BUCKET_NAME || '',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  awsRegion: process.env.AWS_REGION || '',
  JWT_SECRET_KEY: process.env.JWT || '',
};

export default config;
