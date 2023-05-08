export class AppError {
  message
  StatusCode

  constructor (message, StatusCode = 400) {
    this.message = message
    this.StatusCode = StatusCode
  }
}