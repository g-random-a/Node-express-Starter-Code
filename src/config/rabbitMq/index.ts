import amqp, { Channel, Connection, Options } from 'amqplib';
import config from '../configs';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;
const QUEUE_NAME = 'question-response-microservice-events';

let connection: Connection | null = null;
let channel: Channel | null = null;

const connectRabbitMQ = async (): Promise<void> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log('🟢 Attempting to connect to RabbitMQ...');

      // Create connection options
      const credentials: Options.Connect = {
        hostname: config.rabbitmqHost,
        username: config.rabbitmqUsername,
        password: config.rabbitmqPassword,
        port: config.rabbitmqPort,
      };

      // Establish connection
      connection = await amqp.connect(credentials);

      // Create channel
      channel = await connection.createChannel();

      // Declare queue
      await channel.assertQueue(QUEUE_NAME, { durable: true });

      return; // Exit on successful connection
    } catch (error) {
      retries += 1;
      console.error(
        `RabbitMQ connection attempt failed (Retry ${retries}/${MAX_RETRIES}):`,
        error,
      );

      if (retries < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * retries;
        console.log(`Retrying connection in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error('Max retries reached. RabbitMQ connection failed.');
        throw error;
      }
    }
  }
};

const closeRabbitMQ = async (): Promise<void> => {
  try {
    if (channel) {
      await channel.close();
      console.log('RabbitMQ channel closed.');
    }
    if (connection) {
      await connection.close();
      console.log('RabbitMQ connection closed.');
    }
  } catch (error) {
    console.error('Failed to close RabbitMQ connection:', error);
  }
};

// const attemptReconnect = async (): Promise<void> => {
//   console.log('Reconnecting to RabbitMQ...');
//   try {
//     await connectRabbitMQ();
//   } catch (error) {
//     console.error('RabbitMQ reconnection failed:', error);
//   }
// };

const getChannel = (): Channel => {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized');
  }
  return channel;
};

export { connectRabbitMQ, closeRabbitMQ, getChannel, QUEUE_NAME };
