// For structuring API responses in a consistent format

export class ApiResponse {
  constructor (statusCode, data = null, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = true;
  }
}
