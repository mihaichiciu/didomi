export class ApiError extends Error {
  public statusCode: number;
  public data: any;

  constructor(message: string, statusCode: number, data: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found', data: any = null) {
    super(message, 404, data);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnprocessableEntityError extends ApiError {
  constructor(message = 'Unprocessable Entity', data: any = null) {
    super(message, 422, data);
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict', data: any = null) {
    super(message, 409, data);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error', data: any = null) {
    super(message, 500, data);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
