import { Channel, ConsumeMessage } from "amqplib";
import { getChannel, QUEUE_NAME } from "../rabbitmq"; // Updated path

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;
let retries = 0;

export const consumeMessages = async (): Promise<void> => {
  try {
    const channel = getChannel();

    // Declare the queue before consuming
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`Queue "${QUEUE_NAME}" asserted and ready.`);

    console.log(`Waiting for messages in queue "${QUEUE_NAME}"...`);

    // Start consuming messages
    await channel.consume(
      QUEUE_NAME,
      (msg) => {
        if (msg) {
          console.log(`Received message from queue "${QUEUE_NAME}": ${msg.content.toString()}`);
          processMessage(msg, channel);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    if (retries < MAX_RETRIES) {
      retries++;
      console.error(`RabbitMQ consumer error. Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      setTimeout(consumeMessages, RETRY_DELAY_MS);
    } else {
      console.error("Max retries reached. Failed to start RabbitMQ consumer.");
    }
  }
};

const processMessage = (msg: ConsumeMessage, channel: Channel): void => {
  try {
    const message = msg.content.toString();
    const messageObj = JSON.parse(message);
    console.log("Processing message:", messageObj);

    // Simulate processing logic (you can add database or service calls here)
    console.log(`Processed message successfully: ${messageObj}`);

    // Acknowledge the message
    channel.ack(msg);
  } catch (error) {
    console.error("Error processing message:", error);
    channel.nack(msg, false, false); // Reject message without requeue
  }
};
