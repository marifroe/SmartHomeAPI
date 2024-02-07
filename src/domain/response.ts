import { HttpStatus } from "../enum/httpStatus.enum";

export class HttpResponse {
  private timeStamp: string;
  private httpStatus: string;
  
  constructor(private statusCode: HttpStatus, private message: string, private data?: {}) {
    this.timeStamp = new Date().toLocaleString();
    this.statusCode = statusCode;
    this.httpStatus = HttpStatus[statusCode];
    this.message = message;
    this.data = data;
  }
}