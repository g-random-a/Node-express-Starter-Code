import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    rabbitmqHost: process.env.RABBITMQ_URL || 'localhost',
    rabbitmqQueue: process.env.RABBITMQ_QUEUE || 'platformX',
    rabbitmqUsername: process.env.RABBITMQ_USERNAME || 'annotation_ms',
    rabbitmqPassword: process.env.RABBITMQ_PASSWORD || '11223344',
    rabbitmqPort: Number(process.env.RABBITMQ_PORT) || 5672,
};