export class ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;

  constructor(message: string, data?: T) {
    this.success = true;
    this.message = message;
    if (data !== undefined) this.data = data;
  }
}