import { getChannel, QUEUE_NAME } from "./index";

export const publishMessage = async (message: string): Promise<void> => {
  try {
    const channel = getChannel();

    // Send message to the queue
    await channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });
    console.log(`Message published to queue "${QUEUE_NAME}": ${message}`);
  } catch (error) {
    console.error("Error publishing message to RabbitMQ:", error);
  }
};
