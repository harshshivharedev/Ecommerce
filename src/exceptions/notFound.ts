import { ErrorCode, HttpException } from "./root.js";

export class notFoundException extends HttpException {
    constructor(message: string, errorCode:ErrorCode){
        super(message, errorCode, 400, null);
    }
}