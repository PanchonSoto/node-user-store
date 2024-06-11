import { Request, Response } from "express";
import { CustomError } from "../../domain";





export class FileUploadController {

    constructor(
        // private readonly categoryService: CategoryService
    ){}

    private handleError = (error:unknown, res: Response) => {
        if(error instanceof CustomError) {
            return res.status(error.statusCode).json({error: error.message});
        }

        return res.status(500).json({error: 'Internal server error'});
    }





    uploadFile = (req: Request, res: Response) => {

        res.json('uploadFile');

    }

    uploadMultipleFiles = (req: Request, res: Response) => {

        res.json('uploadMultipleFile');

    }

}
