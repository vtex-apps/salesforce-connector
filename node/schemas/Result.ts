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

  error(message:string, data:any):void {
    this.status = 500;
    this.message = message;
    this.data = data;
  }

  fail(data:any):void {
    this.status = 500;
    this.data = data;
  }

  ok(data:any):void {
    this.status = 200;
    this.data = data;
  }

  result(status:number, message:string, data:any):void {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  rst(status:number, data:any):void {
    this.status = status;
    this.data = data;
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
