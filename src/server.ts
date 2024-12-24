import { app, configureApp } from './app';
import { globalErrorHandler } from './middleware/errorHandler';

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await configureApp();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
