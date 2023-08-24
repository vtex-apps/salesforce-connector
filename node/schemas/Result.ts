export class Result {
  status: number;

  message: string;

  data: any;

  constructor() {
    this.status = 200;
    this.message = '';
  }

  isOk(){
    return this.status == 200;
  }

  static TaskError(message : string) : Result {
    const result = new Result();
    result.status = 500;
    result.message = message;
    result.data = undefined;
    return result;
  }

  static TaskOk(data : any) : Result {
    const result = new Result();
    result.status = 200;
    result.message = "OK";
    result.data = data;
    return result;
  }

  static TaskResult(status: number, message : string, data : any) : Result {
    const result = new Result();
    result.status = status;
    result.message = message;
    result.data = data;
    return result;
  }
}
