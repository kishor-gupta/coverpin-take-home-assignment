export class AccessDeniedError extends Error {
  constructor(message = 'Access denied') {
    super(message)
    this.name = 'AccessDeniedError'
  }
}

export class ValidationError extends Error {
  errors: Record<string, string>

  constructor(errors: Record<string, string>, message = 'Order is not ready to place') {
    super(message)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Order not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}
