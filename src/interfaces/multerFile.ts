import { Request } from "express";

interface MulterFileRequest extends Request{
    file: any
}

export default MulterFileRequest;