export class Result {
  public status: number

  public message: string

  public data: any

  constructor() {
    this.status = 200
    this.message = ''
  }

  public isOk() {
    return this.status === 200
  }

  public static TaskError(message: string): Result {
    const result = new Result()
    result.status = 500
    result.message = message
    result.data = undefined
    return result
  }

  public static TaskOk(data: any): Result {
    const result = new Result()
    result.status = 200
    result.message = 'OK'
    result.data = data
    return result
  }

  public static TaskResult(status: number, message: string, data: any): Result {
    const result = new Result()
    result.status = status
    result.message = message
    result.data = data
    return result
  }
}
