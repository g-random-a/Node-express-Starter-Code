export interface SuccessResponseData<T> {
  status: 'success';
  message: string;
  data: T;
  timestamp?: string;
}

export class SuccessResponse<T> {
  private httpStatus: number;
  private message: string;
  private data: T;
  private timestamp?: string;

  constructor(
    status: number,
    message: string,
    data: T,
    includeTimestamp = true,
  ) {
    this.httpStatus = status;
    this.message = message;
    this.data = data;

    if (includeTimestamp) {
      this.timestamp = new Date().toISOString();
    }
  }

  public getStatus(): number {
    return this.httpStatus;
  }

  public getBody(): SuccessResponseData<T> {
    const response: SuccessResponseData<T> = {
      status: 'success',
      message: this.message,
      data: this.data,
    };

    if (this.timestamp) {
      response.timestamp = this.timestamp;
    }

    return response;
  }
}

export default SuccessResponse;
