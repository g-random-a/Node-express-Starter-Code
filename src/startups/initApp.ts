import connectDB from '../config/db/database';
import { connectRabbitMQ, getChannel } from '../config/rabbitMq';
import { consumeMessages } from '../utils/rabbitmq/subscriber';

const InitApp = async () => {
  try {
    await connectDB();

    await connectRabbitMQ();

    getChannel();
    consumeMessages();

    console.log('✅ RabbitMQ connected and consumer started.');
    console.log('----------------------------------------');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

export default InitApp;
