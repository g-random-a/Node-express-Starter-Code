class FailureError extends Error {
  public statusCode: number;
  public errorCode: string;
  public details?: { [key: string]: unknown } | null;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    errorCode = 'INTERNAL_SERVER_ERROR',
    details: { [key: string]: unknown } | null = null,
    isOperational = true, // This can now be set based on the type of error
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational; // Use the passed value to set if it's operational or not

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default FailureError;
